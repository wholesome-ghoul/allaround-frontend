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
  contentRef: React.RefObject<HTMLDivElement>;
};

const Bar = ({ contentRef }: Props) => {
  const [needNavbar, setIsNavbar] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

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

  const openSidebar = () => {
    setIsSidebarOpen(true);
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
              icon={<Icons.DefaultAvatarIcon size="large" />}
              gridPosition={{ colPos: "12/13" }}
              noBorder
              transparent
            />
          </Navbar>

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
      )}
    </>
  );
};

export default Bar;
