import { Button } from "../button/button";

const CallToAction: React.FC<{
  text: string;
  buttonText: string;
  buttonLink: string;
}> = ({ text, buttonText, buttonLink }) => {
  return (
    <div className="mx-auto w-1/2 text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <p className="mb-3 font-bold text-xl text-red-500">{text}</p>
      <Button text={buttonText} link={buttonLink} />
    </div>
  );
};

export default CallToAction;
