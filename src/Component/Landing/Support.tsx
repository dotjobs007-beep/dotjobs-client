"use client";

import { useRouter } from "next/navigation";
import React, { useState, FormEvent } from "react";
import Card from "../Card";

type FAQ = {
  q: string;
  a: string;
};

const faqs: FAQ[] = [
  {
    q: "How can I contact support?",
    a: "You can use the contact form below, email us at support@dotjob.app, or call our support line. We usually respond within 24 hours.",
  },
  {
    q: "What are your support hours?",
    a: "Our primary support hours are 9:00 — 18:00 (local time), Monday to Friday. For urgent issues, use the phone number provided.",
  },
  {
    q: "Where can I find documentation?",
    a: "Visit our documentation center in the Help section. We also include links to common guides in the support panel.",
  },
];

export default function Support() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const router = useRouter();

  function toggleFAQ(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Please enter your name.";
    if (!email.trim()) e.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      e.email = "Please enter a valid email.";
    if (!message.trim()) e.message = "Please enter a message.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    const subject = encodeURIComponent(`Support Request from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    const mailto = `mailto:supports@dotjobs.online?subject=${subject}&body=${body}`;

    // Open the user's email client
    window.location.href = mailto;

    // Optionally reset form
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setStatus("success");
  }

  return (
    <section
      className="max-w-6xl mx-auto px-4 py-12"
      aria-labelledby="support-heading"
    >
      <div className="text-center mb-8">
        <h2 id="support-heading" className="text-3xl font-semibold">
          Support
        </h2>
        <p className="text-gray-600 mt-2">We are here to help </p>
      </div>

      <div className="">
        <div className="lg:col-span-2">
          <Card className="shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium">Send us a message</h3>
            <p className="text-sm text-gray-500 mt-1">
              Describe your issue and we will get back to you as soon as
              possible.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid grid-cols-1 gap-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.name ? "border-red-400" : ""
                    }`}
                    placeholder="Your name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-600 text-sm mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.email ? "border-red-400" : ""
                    }`}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-600 text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className={`mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    errors.message ? "border-red-400" : ""
                  }`}
                  placeholder="How can we help?"
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                />
                {errors.message && (
                  <p id="message-error" className="text-red-600 text-sm mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                >
                  {status === "sending" ? "Sending..." : "Send message"}
                </button>

                <p className="text-xs text-gray-500 mt-2">
                  Clicking “Send message” will open your default email app.
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
