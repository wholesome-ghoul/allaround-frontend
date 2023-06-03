import Button from "./button";

const Input = () => {
  return <input />;
};

const SignUp = () => {
  return (
    <div>
      <Input />
      <Input />
      <Button
        onClick={() => {
          console.log("nice");
        }}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default SignUp;
