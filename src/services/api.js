import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = "https://qa-backend.myepictrip.app";

export const requestSignUpGuest = async (dados) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/registeruserguest`, dados)
    return response
  }catch (error) {
    throw error;
  }
};

export const requestLogin = async (dados) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, dados);
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestGenerateToken = async (dados) => {
  console.log("dados: ", dados);
  try {
    const response = await axios.post(
      `${BASE_URL}/passwordtokens/generatetoken/${dados.username}`,
    );
    return response.status;
  } catch (error) {
    throw error;
  }
};

export const requestValidateToken = async (dados) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/passwordtokens/checktoken/${dados.token}`,
    );
    console.log("API", response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestChangePassword = async (dados) => {
  try {
    const headers = {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };
    const response = await axios.post(
      `${BASE_URL}/users/changepassword`,
      dados,
      {
        headers,
      }
    );
    return response.status;
  } catch (error) {
    throw error;
  }
};
