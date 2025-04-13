export const fetchRecentMemories = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:3000/memories/recent", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch recent memories");
    }

    return await response.json(); 
  } catch (error) {
    console.error("Error fetching recent memories:", error.message);
    throw error;
  }
};