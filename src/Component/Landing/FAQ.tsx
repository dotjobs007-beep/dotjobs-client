"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const AccordionItem = ({ question, answer }: { question: any; answer: any }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full py-4 text-left text-lg font-medium focus:outline-none"
      >
        {question}
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <div className="pb-4 text-gray-600">{answer}</div>}
    </div>
  );
};

export default function FAQ() {
  const faqs = [
    {
      question: "What is Dot Jobs?",
      answer:
        "Dot Jobs is an open-source job and talent platform for the Polkadot and Kusama ecosystems, connecting projects with the right talent and helping people grow their Web3 careers.",
    },
    {
      question: "Who can use Dot Jobs?",
      answer: (
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Job seekers:</strong> Anyone looking for opportunities in Web3
            (developers, designers, community managers, etc.).
          </li>
          <li>
            <strong>Employers:</strong> Any project or team in the Polkadot/Kusama
            ecosystem.
          </li>
        </ul>
      ),
    },
    {
      question: "How do I apply for jobs?",
      answer:
        "Sign up or log in, go to Find Jobs, search for your preferred role, and apply directly.",
    },
    {
      question: "How do I post a job?",
      answer:
        "Employers must complete on-chain identity verification. Then click Post Job, connect your wallet, and fill in the job details.",
    },
    {
      question: "Do I need on-chain identity?",
      answer: (
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Employers:</strong> Yes, verification is compulsory before
            posting.
          </li>
          <li>
            <strong>Job seekers:</strong> Not required, but connecting your wallet is
            encouraged to boost credibility.
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
      <div className="divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} {...faq} />
        ))}
      </div>
    </div>
  );
}
