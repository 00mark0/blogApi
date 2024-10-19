import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-center">About Me</h2>
        <p className="text-center">
          This is the about page. More content coming soon!
        </p>
      </div>
      <div className="flex flex-col justify-center items-center mt-4">
        <div className="flex space-x-4 mb-4">
          <a
            href="https://github.com/00mark0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-600"
          >
            <FontAwesomeIcon
              icon={faGithub}
              size="2x"
              className="transition ease duration-300 hover:scale-125"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/marko-radojkovic-55583b287/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-500"
          >
            <FontAwesomeIcon
              icon={faLinkedin}
              size="2x"
              className="transition ease duration-300 hover:scale-125"
            />
          </a>
        </div>
        <div className="flex items-center justify-center gap-4 pb-16">
          <FontAwesomeIcon icon={faEnvelope} size="2x" color="red" />
          <p className="text-center mt-2">00marko.r@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default About;
