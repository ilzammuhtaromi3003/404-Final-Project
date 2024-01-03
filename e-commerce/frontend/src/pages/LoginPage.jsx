import React, { useState } from "react";
// import './LoginPage.css';
import ToastMessage from "../Components/toast";
import { useNavigate } from "react-router-dom";
import { Center, useToast } from "@chakra-ui/react";
import { loginUser, registerUser } from "../api/api";
import { useAuth } from "../context/AuthContext";
import LoginImage from "../assets/login.jpg";
import {
  Box,
  Grid,
  Input,
  Button,
  VStack,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Image,
  Text,
} from "@chakra-ui/react";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerAffiliateCode, setRegisterAffiliateCode] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastStatus, setToastStatus] = useState("success");
  const [toastMessage, setToastMessage] = useState("");
  const toast = useToast();

  const handleToastClose = () => {
    setShowToast(false);
  };
  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      if (!email || !password) {
        console.error("Please fill in all required fields");
        setToastStatus("error");
        setToastMessage("Please fill in all required fields");
        setShowToast(true);
        return;
      }

      const tokenObject = await loginUser(email, password);
      console.log("Received token:", { tokenObject });

      const token = tokenObject.token;

      console.log("Extracted token:", token);

      login(token);

      // Clear form fields
      setEmail("");
      setPassword("");
      navigate("/");
      setToastStatus("success");
      setToastMessage("Login successful!");
      setShowToast(true);
    } catch (error) {
      console.error("Login failed", error);

      setToastStatus("error");
      setToastMessage(`Login failed: ${error.message}`);
      setShowToast(true);
    }
  };

  const handleRegister = async () => {
    try {
      if (!registerUsername || !registerEmail || !registerPassword) {
        console.error("Please fill in all required fields");
        setToastStatus("error");
        setToastMessage("Please fill in all required fields");
        setShowToast(true);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerEmail)) {
        console.error("Invalid email format");
        setToastStatus("error");
        setToastMessage("Invalid email format");
        setShowToast(true);
        return;
      }

      // Validate password match
      if (registerPassword !== registerConfirmPassword) {
        console.error("Password and confirm password do not match");
        setToastStatus("error");
        setToastMessage("Password and confirm password do not match");
        setShowToast(true);
        return;
      }

      if (registerPassword.length < 6) {
        console.error("Password must be at least 6 characters long");
        setToastStatus("error");
        setToastMessage("Password must be at least 6 characters long");
        setShowToast(true);
        return;
      }

      const userData = {
        full_name: registerUsername,
        email: registerEmail,
        password: registerPassword,
        confirmPassword: registerConfirmPassword,
        affiliateCodeInput: registerAffiliateCode,
      };

      await registerUser(userData);

      setRegisterUsername("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setRegisterAffiliateCode("");

      setToastStatus("success");
      setToastMessage("Registration successful!");
      setShowToast(true);
    } catch (error) {
      console.error("Registration failed", error);

      setToastStatus("error");
      setToastMessage(`Registration failed: ${error.message}`);
      setShowToast(true);
    }
  };

  return (
    <Center h="100vh" align="center">
      <Box>
        <Grid
          templateColumns="repeat(2, 1fr)"
          gap={4}
          justifyItems="center"
          alignItems="center"
        >
          <Box className="image-container">
            <Image boxSize={"450px"} src={LoginImage} alt="Login Image" />
          </Box>
          <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
            <Heading mb={4}>Welcome Back!</Heading>
            <VStack spacing={4} align="stretch" mb={4}>
              <Tabs
                isFitted
                variant="enclosed"
                onChange={handleTabChange}
                defaultIndex={0}
                colorScheme="teal"
              >
                <TabPanels>
                  <TabPanel>
                    <VStack mt={10} spacing={4} align="stretch">
                      <Input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        colorScheme="teal"
                        minWidth="100%"
                        onClick={() => handleLogin(email, password)}
                      >
                        Login
                      </Button>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack mt={10} spacing={4} align="stretch">
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        value={registerConfirmPassword}
                        onChange={(e) =>
                          setRegisterConfirmPassword(e.target.value)
                        }
                      />
                      <Box>
                        <Text align="start" textColor="gray.400">
                          optional
                        </Text>
                        <Input
                          type="text"
                          placeholder="Affiliate Code"
                          value={registerAffiliateCode}
                          onChange={(e) =>
                            setRegisterAffiliateCode(e.target.value)
                          }
                        />
                      </Box>
                      <Button
                        colorScheme="teal"
                        minWidth="100%"
                        onClick={handleRegister}
                      >
                        Register
                      </Button>
                    </VStack>
                  </TabPanel>
                </TabPanels>
                <TabList mt={10} spacing={5} className="tab-list">
                  <Tab
                    minWidth="120px"
                    style={{
                      background: activeTab === 0 ? "white" : "teal",
                      color: activeTab === 0 ? "black" : "white",
                    }}
                  >
                    Login
                  </Tab>
                  <Tab
                    minWidth="120px"
                    style={{
                      background: activeTab === 1 ? "white" : "teal",
                      color: activeTab === 1 ? "black" : "white",
                    }}
                  >
                    Register
                  </Tab>
                </TabList>
              </Tabs>
            </VStack>
          </Box>
        </Grid>
      </Box>
      {showToast && (
        <ToastMessage
          status={toastStatus}
          message={toastMessage}
          onClose={handleToastClose}
        />
      )}
    </Center>
  );
};

export default LoginPage;
