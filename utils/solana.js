import React, { useState, useEffect } from "react";
import { completeTask, fetchTaskStatus } from "./solanaFunctions"; // Import your functions

const TaskComponent = () => {
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch Task Status on Mount
    useEffect(() => {
        const checkTaskStatus = async () => {
            const isCompleted = await fetchTaskStatus();
            setTaskCompleted(!isCompleted); // If not available, mark as completed
        };
        checkTaskStatus();
    }, []);

    const handleCompleteTask = async () => {
        setLoading(true);
        await completeTask("Receiver_Public_Key_Here"); // Replace with a valid receiver
        setTaskCompleted(true); // Mark as completed after success
        setLoading(false);
    };

    return (
        <div>
            <button
                onClick={handleCompleteTask}
                disabled={taskCompleted || loading}
                style={{
                    backgroundColor: taskCompleted ? "green" : "gray",
                    cursor: taskCompleted ? "default" : "pointer",
                }}
            >
                {loading ? "Processing..." : taskCompleted ? "Completed" : "Complete Task"}
            </button>
        </div>
    );
};

export default TaskComponent;
