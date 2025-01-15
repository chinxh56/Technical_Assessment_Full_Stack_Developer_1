/* eslint-disable no-useless-catch */
import axios from "axios";
import { itemURL } from "./itemURL";

export const itemAPI = {
  async getAllItems() {
    try {
      const response = await axios.get(`${itemURL.itemurl}/api/all`);

      return response;
    } catch (error) {
      throw error;
    }
  },

  async getSelectedItem(params: any) {
    try {
      const response = await axios.get(`${itemURL.itemurl}/api/` + params);

      return response;
    } catch (error) {
      throw error;
    }
  },

  async createItem(params: any) {
    try {
      const response = await axios.post(
        `${itemURL.itemurl}/api/create`,
        params
      );

      return response;
    } catch (error) {
      throw error;
    }
  },

  async editItem(params: any) {
    try {
      console.log("params", params);
      const response = await axios.put(
        `${itemURL.itemurl}/api/edit/${params.id}`,
        params
      );

      return response;
    } catch (error) {
      throw error;
    }
  },

  async deleteItem(params: any) {
    try {
      const response = await axios.delete(
        `${itemURL.itemurl}/api/delete/${params.id}`
      );

      return response;
    } catch (error) {
      throw error;
    }
  },
};
