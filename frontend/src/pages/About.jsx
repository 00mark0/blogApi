import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-center">About Me</h2>
        <p className="text-center md:w-1/4 mx-auto font-bold text-lg">
          Hello! I&apos;m Marko Radojkovic, a passionate self-taught web
          developer from Serbia. With a strong desire to learn and improve, I
          have dedicated myself to mastering the art of web development. My
          journey has been fueled by a love for creating useful applications
          that can make a difference in people&apos;s lives.
        </p>
        <p className="text-center mt-4 md:w-1/4 mx-auto font-bold text-lg">
          I am always on the lookout for exciting projects and collaborations
          that can help me further develop my skills and make a positive impact.
          Whether it&apos;s building innovative web applications or solving
          complex problems, I am committed to delivering high-quality solutions
          that meet the needs of users.
        </p>
        <p className="text-center mt-4 md:w-1/4 mx-auto font-bold text-lg">
          In addition to my technical skills, I am also driven by a desire to
          achieve financial independence through my work. I believe that by
          combining my passion for web development with a strong work ethic, I
          can create valuable products and services that not only benefit others
          but also provide me with the means to support myself and my
          aspirations.
        </p>
        <p className="text-center mt-4 md:w-1/4 mx-auto font-bold text-lg">
          Thank you for taking the time to learn more about me. I look forward
          to connecting with like-minded individuals and exploring new
          opportunities in the world of web development.
        </p>
      </div>
      <div className="flex flex-col justify-center items-center mt-8">
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
