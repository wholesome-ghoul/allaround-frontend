import {
  Navbar,
  Sidebar,
  Icons,
  Button,
  Text,
  Container,
  hooks,
} from "@allaround/all-components";
import { useEffect, useRef, useState } from "react";

import { theme } from "../utils";

const { useResizeObserver, useEventListener } = hooks;

type Props = {
  children?: React.ReactNode;
};

const HomeBar = ({ children }: Props) => {
  const [needNavbar, setIsNavbar] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navbarContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
      if (navbarContainerRef.current)
        navbarContainerRef.current.style.opacity = "0.3";
    } else {
      document.body.style.overflow = "visible";
      if (navbarContainerRef.current)
        navbarContainerRef.current.style.opacity = "1";
    }
  }, [isSidebarOpen]);

  return (
    <>
      {needNavbar ? (
        <>
          <Container
            grid={{
              cols: 1,
              rows: "auto",
            }}
            innerRef={navbarContainerRef}
          >
            <Navbar
              styles={{ padding: "0 1rem" }}
              grid={{ cols: "repeat(12, 1fr)", rows: 1 }}
              sticky
            >
              <Button
                onClick={openSidebar}
                icon={<Icons.HamburgerIcon size="large" />}
                noBorder
                transparent
              />
              <Button
                onClick={() => {}}
                icon={<Icons.DefaultAvatarIcon size="large" />}
                gridPosition={{ colPos: "12/13" }}
                noBorder
                transparent
              />
            </Navbar>

            <Container
              noGrid
              gridPosition={{ colPos: "1/13" }}
              styles={{ height: "1200px" }}
            >
              {children}
            </Container>
          </Container>

          <Container
            noGrid
            styles={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              zIndex: 100,
              transition: "transform 0.3s ease",
              transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <Sidebar
              innerRef={sidebarRef}
              overlap
              styles={{ justifyItems: "left" }}
            >
              <Button
                onClick={() => {}}
                icon={<Icons.SunIcon size="large" />}
                gridPosition={{ rowPos: "3/4" }}
                transparent
                noBorder
              >
                <Text size="medium">Change Theme</Text>
              </Button>
            </Sidebar>
          </Container>
        </>
      ) : (
        <Container
          grid={{
            rows: 1,
            cols: "minmax(72px, auto) repeat(7, minmax(0px, 1fr))",
          }}
        >
          <Sidebar sticky>
            <Button
              onClick={() => {}}
              icon={<Icons.AaIcon size="xlarge" />}
              noBorder
              transparent
            ></Button>
            <Button
              onClick={() => {}}
              icon={<Icons.SunIcon size="medium" />}
              gridPosition={{ rowPos: "3/4" }}
              transparent
              noBorder
            ></Button>
          </Sidebar>

          <Container noGrid gridPosition={{ colPos: "2/9" }}>
            {children}
          </Container>
        </Container>
      )}
    </>
  );
};

export default HomeBar;
