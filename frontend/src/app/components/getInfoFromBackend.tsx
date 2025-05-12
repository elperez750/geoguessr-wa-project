"use client";

import React, { useState, useEffect } from "react";
import api from "...@/app/api";

interface Item {
    name: string;
}

export const GetInfoFromBackend = () => {
    const [itemName, setItemName] = useState("");
    const [items, setItems] = useState<Item[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItemName(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const newItem = { name: itemName };
            await api.post("/items", newItem);

            // Update UI list
            setItems((prev) => [...prev, newItem]);
            setItemName("");
        } catch (error) {
            console.log("❌ Error submitting item:", error);
        }
    };

    // Optional: load items from backend
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await api.get("/items");
                setItems(res.data);
            } catch (err) {
                console.log("❌ Error fetching items:", err);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Get Information</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="itemName" className="block mb-1">
                        Item Name
                    </label>
                    <input
                        id="itemName"
                        type="text"
                        name="name"
                        value={itemName}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>
            <div className="mt-4">
                <h3 className="font-bold">Items:</h3>
                <ul className="mt-2 list-disc ml-6">
                    {items.map((item, i) => (
                        <li key={i}>{item.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
