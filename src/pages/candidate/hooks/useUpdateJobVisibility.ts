import api from "@/lib/axios";
import { useCallback, useState, useEffect } from "react";

export interface VisibilitySettings {
    openToWork: boolean;
    showProfileInSearch: boolean;
    hideFromCureentEmployers: boolean;
}

export const useUpdateJobVisibility = () => {
    const [visibility, setVisibility] = useState<VisibilitySettings>({
        openToWork: true,
        showProfileInSearch: true,
        hideFromCureentEmployers: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchVisibility = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/candidate/visibility/get");
            if (response.data?.data) {
                setVisibility(response.data.data);
            }
        } catch (err) {
            setError(err);
            console.error("Error fetching visibility:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVisibility();
    }, [fetchVisibility]);

    const updateVisibility = useCallback(async (updatedKey: keyof VisibilitySettings, value: boolean) => {
        try {
            setLoading(true);
            // Optimistic update
            setVisibility(prev => ({
                ...prev,
                [updatedKey]: value
            }));

            const response = await api.put("/api/candidate/visibility/update", {
                [updatedKey]: value
            });
            console.log("Visibility update response:", response.data);
            await fetchVisibility();
        } catch (err) {
            setError(err);
            console.error("Error updating visibility:", err);
            // Revert state on error
            setVisibility(prev => ({
                ...prev,
                [updatedKey]: !value
            }));
        } finally {
            setLoading(false);
        }
    }, [fetchVisibility]);

    return {
        visibility,
        loading,
        error,
        updateVisibility,
        fetchVisibility,
    };
};
