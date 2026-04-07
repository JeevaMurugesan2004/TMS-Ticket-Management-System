import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Send, AlertTriangle, MapPin, ClipboardList, Paperclip } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ComplaintRaisingScreen = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [blocks, setBlocks] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [formData, setFormData] = useState({
        block: "",
        room: "",
        complaintType: "",
        remarks: "",
        attachment: null
    });

    const complaintTypes = [
        "PC Hardware",
        "PC Software",
        "Application Issues",
        "Network",
        "Electronics",
        "Plumbing"
    ];

    useEffect(() => {
        fetchLocationData();
    }, []);

    const fetchLocationData = async () => {
        try {
            const [blockRes, roomRes] = await Promise.all([
                axios.get("/api/master/blocks"),
                axios.get("/api/master/rooms")
            ]);

            setBlocks(blockRes.data);
            setRooms(roomRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("block", formData.block);
        data.append("room", formData.room);
        data.append("complaintType", formData.complaintType);
        data.append("remarks", formData.remarks);
        if (formData.attachment) {
            data.append("attachment", formData.attachment);
        }

        try {
            await axios.post("/api/complaints", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Complaint raised successfully!");
            navigate("/");
        } catch (err) {
            alert("Failed to raise complaint");
        }
    };

    return (
        <div className="container" style={{ maxWidth: "900px" }}>
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div
                        style={{
                            background: "var(--danger)15",
                            color: "var(--danger)",
                            padding: "1rem",
                            borderRadius: "1.25rem",
                            display: "flex"
                        }}
                    >
                        <AlertTriangle size={32} />
                    </div>

                    <div>
                        <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>
                            Raise Complaint
                        </h2>
                        <p style={{ color: "var(--secondary)", fontWeight: "500" }}>
                            Submit a new issue ticket for resolution
                        </p>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "2rem"
                }}
            >
                {/* Location Card */}
                <div className="card" style={{ height: "fit-content", overflow: "visible" }}>
                    <h3
                        style={{
                            fontSize: "1.125rem",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "1.5rem"
                        }}
                    >
                        <MapPin size={20} /> Location Details
                    </h3>

                    {/* Block Select */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: "600",
                                fontSize: "0.875rem"
                            }}
                        >
                            Block Name
                        </label>

                        <select
                            value={formData.block}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    block: e.target.value,
                                    room: ""
                                })
                            }
                            required
                            style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "12px",
                                border: "1px solid #d1d5db"
                            }}
                        >
                            <option value="">Select Block</option>

                            {blocks.map((b) => (
                                <option key={b._id} value={b._id}>
                                    {b.blockName} ({b.department?.shortName})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Room Select */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: "600",
                                fontSize: "0.875rem"
                            }}
                        >
                            Room / Lab Number
                        </label>

                        <select
                            value={formData.room}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    room: e.target.value
                                })
                            }
                            required
                            disabled={!formData.block}
                            style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "12px",
                                border: "1px solid #d1d5db"
                            }}
                        >
                            <option value="">Select Room</option>

                            {rooms
                                .filter((r) => (r.block?._id || r.block) === formData.block)
                                .map((r) => (
                                    <option key={r._id} value={r._id}>
                                        {r.roomNumber}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                {/* Issue Details Card */}
                <div className="card">
                    <h3
                        style={{
                            fontSize: "1.125rem",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "1.5rem"
                        }}
                    >
                        <ClipboardList size={20} /> Issue Details
                    </h3>

                    {/* Complaint Type */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: "600",
                                fontSize: "0.875rem"
                            }}
                        >
                            Complaint Category
                        </label>

                        <select
                            value={formData.complaintType}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    complaintType: e.target.value
                                })
                            }
                            required
                            style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "12px",
                                border: "1px solid #d1d5db"
                            }}
                        >
                            <option value="">Select Category</option>

                            {complaintTypes.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Remarks */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: "600",
                                fontSize: "0.875rem"
                            }}
                        >
                            Describe the Problem
                        </label>

                        <textarea
                            rows="4"
                            value={formData.remarks}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    remarks: e.target.value
                                })
                            }
                            placeholder="Please provide details like PC number or issue..."
                            style={{ resize: "none", width: "100%" }}
                            required
                        />
                    </div>

                    {/* Attachment */}
                    <div style={{ marginBottom: "2rem" }}>
                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                marginBottom: "0.5rem",
                                fontWeight: "600",
                                fontSize: "0.875rem"
                            }}
                        >
                            <Paperclip size={16} /> Attach Screenshot / File (Optional)
                        </label>

                        <input
                            type="file"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    attachment: e.target.files[0]
                                })
                            }
                            style={{ 
                                width: "100%", 
                                padding: "10px",
                                background: "white",
                                borderRadius: "8px",
                                border: "1px solid #d1d5db"
                            }}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "1rem",
                            background:
                                "linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            fontSize: "16px"
                        }}
                    >
                        <Send size={18} /> Submit Issue Ticket
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ComplaintRaisingScreen;