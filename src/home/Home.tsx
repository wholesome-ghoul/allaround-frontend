import {
  Navbar,
  Sidebar,
  Heading,
  Icons,
  Button,
  Container,
  hooks,
} from "@allaround/all-components";
import { useRef, useState } from "react";

import { theme } from "../utils";

const { useResizeObserver, useEventListener } = hooks;

const Home = () => {
  const [needNavbar, setIsNavbar] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navbarContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useResizeObserver(document.body, (_entries: any) => {
    if (window.innerWidth < theme.bp.nums.md2) {
      setIsNavbar(true);
    } else {
      setIsNavbar(false);
    }
  });

  useEventListener(
    "mousedown",
    (event: any) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);

        document.body.style.overflow = "visible";
        if (navbarContainerRef.current)
          navbarContainerRef.current.style.opacity = "1";
      }
    },
    document
  );

  const openSidebar = () => {
    setIsSidebarOpen(true);

    document.body.style.overflow = "hidden";
    if (navbarContainerRef.current)
      navbarContainerRef.current.style.opacity = "0.3";
  };

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
            <Navbar sticky>
              <Button
                onClick={openSidebar}
                icon={<Icons.MoonIcon size="large" />}
                noBorder
                transparent
              />
              <Button
                onClick={() => {}}
                icon={<Icons.SunIcon size="medium" />}
                gridPosition={{ colPos: "3/4" }}
                transparent
                noBorder
              />
              <Button
                onClick={() => {}}
                icon={<Icons.MoonIcon size="medium" />}
                gridPosition={{ colPos: "4/5" }}
                transparent
                noBorder
              />
            </Navbar>

            <Container
              noGrid
              gridPosition={{ colPos: "1/13" }}
              styles={{ height: "1200px" }}
            >
              <Heading.h1 styles={{ textAlign: "center" }} fill>
                USER HOME
              </Heading.h1>
              <Container styles={{ display: "block", textAlign: "center" }}>
                <Button onClick={() => console.log("OI")}>oi</Button>
              </Container>
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
            <Sidebar innerRef={sidebarRef} overlap>
              <Button
                onClick={() => {}}
                icon={<Icons.MoonIcon size="large" />}
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
              <Button
                onClick={() => {}}
                icon={<Icons.MoonIcon size="medium" />}
                gridPosition={{ rowPos: "4/5" }}
                transparent
                noBorder
              ></Button>
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
              icon={<Icons.MoonIcon size="large" />}
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
            <Button
              onClick={() => {}}
              icon={<Icons.MoonIcon size="medium" />}
              gridPosition={{ rowPos: "4/5" }}
              transparent
              noBorder
            ></Button>
          </Sidebar>

          <Container noGrid gridPosition={{ colPos: "2/9" }}>
            <Heading.h1 styles={{ textAlign: "center" }} fill>
              USER HOME
            </Heading.h1>
          </Container>
        </Container>
      )}
    </>
  );
};

export default Home;
