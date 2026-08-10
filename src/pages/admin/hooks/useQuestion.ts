import api from "@/lib/axios";
import { useState } from "react";

export const useQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  // http://localhost:8080/api/mental-test/create-question
  type QuestionData = {
    question: string;
    options: string[];
  };

  const addQuestion = async (questionData: QuestionData) => {
    try {
      setLoading(true);
      const response = await api.post(
        "/api/mental-test/create-question",
        questionData,
      );
      setData(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      return error;
    }
  };

  const editQuestion = async (questionData: QuestionData, id: string) => {
    try {
      setLoading(true);
      const response = await api.patch(`/api/mental-test/${id}`, questionData);
      setData(() => response?.data);
      setError(() => "");
      setLoading(false);
      return response.data;
    } catch (err) {
      setData(() => "");
      setError(() => err);
      setLoading(false);
      return err;
    }
  };

  return {
    addQuestion,
    editQuestion,
    loading,
    error,
    data,
  };
};
