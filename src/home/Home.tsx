import { Sidebar, Heading } from "@allaround/all-components";

const Home = () => {
  return (
    <>
      <Sidebar />
      <div className="home">
        <Heading.h1 styles={{textAlign: "center"}} fill>USER HOME</Heading.h1>
      </div>
    </>
  );
};

export default Home;
