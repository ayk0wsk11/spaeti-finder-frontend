import { Link } from "react-router-dom";
import { GithubOutlined, InfoCircleOutlined } from "@ant-design/icons";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="footer-content">
        <a
          href="https://github.com/your-repo-1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repo 1"
        >
          <GithubOutlined style={{ fontSize: "24px" }} />
        </a>

        <a
          href="https://github.com/your-repo-2"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repo 2"
        >
          <GithubOutlined style={{ fontSize: "24px" }} />
        </a>

        <Link to="/about" aria-label="About page">
          <InfoCircleOutlined style={{ fontSize: "24px" }} />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
