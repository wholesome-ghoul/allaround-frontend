import { useNavigate } from "react-router-dom";
import {
  Navbar,
  Sidebar,
  Icons,
  Button,
  Text,
  Container,
  Dropdown,
  Image,
  hooks,
} from "@allaround/all-components";
import { useContext, useEffect, useRef, useState } from "react";

import { theme, routes, SocialAccountMap } from "../utils";
import Context from "../context";

const { useResizeObserver, useEventListener } = hooks;

type Props = {
  contentRef: React.RefObject<HTMLDivElement>;
};

const dropdownIndices: { [key: string]: number } = {
  [routes.create.youtubePost]: 0,
} as const;

const Bar = ({ contentRef }: Props) => {
  const [needNavbar, setIsNavbar] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activePage, setActivePage] = useState(window.location.pathname);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const dropdownItemsRef = useRef<HTMLDivElement>(null);
  const { activeAccount } = useContext(Context.Account);
  const navigate = useNavigate();

  useResizeObserver(document.body, (_entries: any) => {
    if (window.innerWidth < theme.bp.nums.md2) {
      setIsNavbar(true);
    } else {
      setIsNavbar(false);
      setIsSidebarOpen(false);
    }
  });

  useEventListener(
    "mousedown",
    (event: any) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    },
    document
  );

  useEventListener(
    "mousedown",
    (event: any) => {
      if (
        dropdownItemsRef.current &&
        !dropdownItemsRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    },
    document
  );

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";

      if (contentRef.current) contentRef.current.style.opacity = "0.3";
      if (navbarRef.current) navbarRef.current.style.opacity = "0.3";
    } else {
      document.body.style.overflow = "visible";

      if (contentRef.current) contentRef.current.style.opacity = "1";
      if (navbarRef.current) navbarRef.current.style.opacity = "1";
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    setSelectedIndex(dropdownIndices[activePage]);
  }, [activePage]);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const handleActivePage = (page: string) => () => {
    setActivePage(page);
    setIsSidebarOpen(false);
    setIsDropdownOpen(false);
    navigate(page);
  };

  return (
    <>
      {needNavbar ? (
        <>
          <Navbar
            styles={{ padding: "0 1rem" }}
            grid={{ cols: "repeat(12, 1fr)", rows: 1 }}
            sticky
            innerRef={navbarRef}
          >
            <Button
              onClick={openSidebar}
              icon={<Icons.HamburgerIcon size="large" />}
              noBorder
              transparent
            />
            <Button
              onClick={() => {}}
              icon={
                activeAccount?.avatar ? (
                  <Image
                    src={activeAccount.avatar}
                    width="36px"
                    height="36px"
                    objectFit="contain"
                  />
                ) : (
                  <Icons.DefaultAvatarIcon size="large" />
                )
              }
              gridPosition={{ colPos: "12/13" }}
              transparent
            />
          </Navbar>

          <Container
            noGrid
            styles={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              zIndex: 1001,
              transition: "transform 0.3s ease",
              transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <Sidebar innerRef={sidebarRef} overlap noGrid>
              <Button
                onClick={handleActivePage(routes.home)}
                icon={<Icons.AaIcon size="large" />}
                transparent={activePage !== routes.home}
                noBorder
                fill
              >
                <Text size="medium">Home</Text>
              </Button>

              <Dropdown
                icon={<Icons.CreateIcon size="medium" />}
                selectedIndex={selectedIndex}
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
                text="Create"
                activeIndicator
                enableArrow
                noDropperBorder
                fill
              >
                {activeAccount?.socials
                  .filter((social) => social.enabled)
                  .map((social) => (
                    <Button
                      onClick={handleActivePage(routes.create.youtubePost)}
                      transparent={activePage !== routes.create.youtubePost}
                      icon={SocialAccountMap[social.icon]}
                      key={social.value}
                      noBorder
                      fill
                    >
                      <Text size="small">{social.name}</Text>
                    </Button>
                  ))}
              </Dropdown>
            </Sidebar>
          </Container>
        </>
      ) : (
        <Sidebar sticky>
          <Button
            onClick={handleActivePage(routes.home)}
            icon={<Icons.AaIcon size="xlarge" />}
            transparent={activePage !== routes.home}
            noBorder
          />

          <Dropdown
            icon={<Icons.CreateIcon size="medium" />}
            selectedIndex={selectedIndex}
            isOpen={isDropdownOpen}
            setIsOpen={setIsDropdownOpen}
            dropdownItemsRef={dropdownItemsRef}
            popup
            fill
            noDropperBorder
          >
            <Button
              onClick={handleActivePage(routes.create.youtubePost)}
              icon={<Icons.CreateIcon size="small" />}
              transparent={activePage !== routes.create.youtubePost}
              noBorder
              fill
            >
              <Text size="small">Youtube</Text>
            </Button>
          </Dropdown>
        </Sidebar>
      )}
    </>
  );
};

export default Bar;
