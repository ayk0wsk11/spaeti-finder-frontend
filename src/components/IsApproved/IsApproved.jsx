import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

const IsApproved = ({ children }) => {
  const { currentUser, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <Flex align="center" gap="middle">
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 48,
              }}
              spin
            />
          }
        />
      </Flex>
    );
  }

  if (currentUser && currentUser.admin) {
    return <div>{children}</div>;
  } else {
    return (
      <div>
        <h2>No access to this page!</h2>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }
};
export default IsApproved;
