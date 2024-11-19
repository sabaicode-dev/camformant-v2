import { Button } from "../button/button";
const CallToAction:React.FC<{
  text:string,
  buttonText:string,
  buttonLink:string,
}> = ({text,buttonText,buttonLink}) => {
  return ( <div>
    <p className="mb-3 font-bold text-xl text-red-500">{text}</p>
   <Button  text={buttonText} link={buttonLink}/>
  </div> );
}
 
export default CallToAction;