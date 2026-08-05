import api from "@/lib/axios";
import { useEffect, useState } from "react";


export const useAddQuestion = () => {
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
// http://localhost:8080/api/mental-test/create-question





type QuestionData = {
    question: string;
    options: string[];
    correctOption: string;
}

const addQuestion = async (questionData: QuestionData) => {
    try {
        setLoading(true);
        const response = await api.post("/api/mental-test/create-question", questionData);
        setData(response.data);
        setLoading(false);
    } catch (error) {
        setError(error);
        setLoading(false);
    }
}

return {
    addQuestion,
    loading,
    error,
    data
}
}
    

