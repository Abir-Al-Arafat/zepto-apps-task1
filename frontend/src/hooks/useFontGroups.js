// src/hooks/useFontGroups.js
import { useEffect, useState, useCallback } from "react";

const API_URL = "http://localhost:3005/fonts/groups";

const useFontGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all groups
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.success || json.groups) {
        setGroups(json.groups || json.data || []);
      } else {
        setError(json.message || "Failed to fetch groups");
      }
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new group
  const createGroup = async ({ name, fonts }) => {
    try {
      setLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("name", name);
      fonts.forEach((font) => formData.append("fonts[]", font));

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        await fetchGroups();
      } else {
        setError(json.message || "Failed to create group");
      }
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Delete entire group
  const deleteGroup = async (groupId) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/${groupId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        await fetchGroups();
      } else {
        setError(json.message || "Failed to delete group");
      }
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Remove font from group
  const deleteFontFromGroup = async ({ groupId, fontName }) => {
    try {
      setLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("groupId", groupId);
      formData.append("fontName", fontName);

      const res = await fetch(`${API_URL}/delete/font`, {
        method: "DELETE",
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        await fetchGroups();
      } else {
        setError(json.message || "Failed to delete font from group");
      }
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Update group (name or font list)
  const updateGroup = async ({ groupId, name, fonts }) => {
    try {
      setLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("name", name);
      fonts.forEach((font) => formData.append("fonts[]", font));

      const res = await fetch(`${API_URL}/${groupId}`, {
        method: "PUT",
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        await fetchGroups();
      } else {
        setError(json.message || "Failed to update group");
      }
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    loading,
    error,
    createGroup,
    deleteGroup,
    deleteFontFromGroup,
    updateGroup,
    refetchGroups: fetchGroups,
  };
};

export default useFontGroups;
