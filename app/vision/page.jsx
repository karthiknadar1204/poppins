"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Vision = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const formik = useFormik({
    initialValues: {
      text: "",
      img_url: "",
    },
    validationSchema: Yup.object({
      text: Yup.string().required("Text is required"),
      img_url: Yup.string().required("Image URL is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      setResponse(null);
      try {
        const res = await fetch("/api/vision", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        console.log("API Response:", data); // Log the response to the console
        if (res.ok) {
          setResponse(data);
        } else {
          setError(data.error || "Failed to get response");
        }
      } catch (error) {
        setError("Failed to get response");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <h1>Image Analyze</h1>
      <form onSubmit={formik.handleSubmit}>
        <textarea
          name="text"
          placeholder="Enter your text"
          {...formik.getFieldProps("text")}
        ></textarea>
        <input
          name="img_url"
          placeholder="Enter your image URL"
          {...formik.getFieldProps("img_url")}
        ></input>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Response"}
        </button>
      </form>
      {response && (
        <div>
          <h2>Responses</h2>
          <p>{response.content}</p>
        </div>
      )}
      {formik?.values?.img_url && (
        <div>
          <h2>Image</h2>
          <img src={formik?.values?.img_url} alt="image" />
        </div>
      )}
      {error && (
        <div style={{ color: "red" }}>
          <FaExclamationCircle /> {error}
        </div>
      )}
    </div>
  );
};

export default Vision;
