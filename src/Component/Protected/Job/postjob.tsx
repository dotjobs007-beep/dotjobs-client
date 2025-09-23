"use client";

export default function PostJob() {
  return (
    <div className="flex flex-col items-center text-[12px] justify-center p-6 max-w-lg mx-auto">
      <h1 className="lg:text-2xl text-[#FF2670] md:text-2xl text-l font-bold mb-4">
        Post a New Job
      </h1>
      <p className="text-center mb-6">
        Fill out the form below to find the best talent in the Polkadot
        Ecosystem.
      </p>

      {/* FORM */}
      <div className="w-full bg-[#98418E] p-6 rounded-lg">
        <form className="flex flex-col gap-4">
          {/* Job Details */}
          <div>
            <h1 className="text-white font-bold mb-4">Job Details</h1>

            <div className="mt-4">
              <label className="block mb-2 font-medium text-white">Job Title</label>
              <input
                type="text"
                placeholder="e.g Senior Software Engineer"
                className="w-full bg-[#FCE9FC] text-[#00000080] rounded-md p-2 
                           focus:outline-none focus:ring-0"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2 font-medium text-white">Job description</label>
              <textarea
                placeholder="Describe the responsibilities, requirements and benefits of the role"
                className="w-full h-[100px] bg-[#FCE9FC] text-[#00000080] rounded-md p-2 
                           focus:outline-none focus:ring-0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-2 font-medium text-white">Employment Type</label>
                <select
                  className="w-full bg-[#FCE9FC] text-[#00000080] rounded-md p-2 focus:outline-none focus:ring-0"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select employment type
                  </option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-white">Work Arrangement</label>
                <select
                  className="w-full bg-[#FCE9FC] text-[#00000080] rounded-md p-2 focus:outline-none focus:ring-0"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select work arrangement
                  </option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on-site">On-site</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-2 font-medium text-white">Salary Type</label>
                <select
                  className="w-full bg-[#FCE9FC] text-[#00000080] rounded-md p-2 focus:outline-none focus:ring-0"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Salary Type
                  </option>
                  <option value="dot">Dot</option>
                  <option value="usdc">Usdc</option>
                  <option value="eth">Eth</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-white">Salary Range</label>
                <input
                  type="text"
                  placeholder="e.g. 800-200"
                  pattern="^[0-9]+-[0-9]+$"
                  title="Enter a range like 800-200"
                  onInput={(e: any) => {
                    e.target.value = e.target.value.replace(/[^0-9-]/g, "");
                  }}
                  className="w-full bg-[#FCE9FC] text-[#000000] rounded-md p-2
                             focus:outline-none focus:ring-0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="mt-6">
            <h1 className="text-white font-bold mb-4">Company Details</h1>

            <div className="mt-4">
              <label className="block mb-2 font-medium text-white">Company Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                className="w-full bg-[#FCE9FC] text-[#00000080] rounded-md p-2 
                           focus:outline-none focus:ring-0"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2 font-medium text-white">Company Website (optional)</label>
              <input
                type="text"
                placeholder="e.g. www.acme.com"
                className="w-full bg-[#FCE9FC] text-[#00000080] rounded-md p-2 
                           focus:outline-none focus:ring-0"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2 font-medium text-white">Company Location</label>
              <input
                type="text"
                placeholder="e.g. New York, NY"
                className="w-full bg-[#FCE9FC] text-[#00000080] rounded-md p-2 
                           focus:outline-none focus:ring-0"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2 font-medium text-white">Company Description (optional)</label>
              <textarea
                placeholder="Briefly describe your company"
                className="w-full h-[100px] bg-[#FCE9FC] text-[#00000080] rounded-md p-2 
                           focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* ✅ New: Company Logo at the Bottom */}
          <div className="mt-6">
            <label className="block mb-2 font-medium text-white">Company Logo</label>
            <input
              type="file"
              accept="image/*"
              className="w-full bg-[#FCE9FC] text-[#00000080] rounded-md p-2
                         focus:outline-none focus:ring-0 file:mr-4 file:py-2 file:px-4 
                         file:rounded-md file:border-0 file:text-sm file:font-semibold 
                         file:bg-[#FF2670] file:text-white hover:file:bg-[#e02666]"
            />
          </div>

          {/* Submit Button */}
          <button className="w-full text-white font-bold py-2 px-4 rounded-md mt-6 bg-[#FF2670] hover:bg-[#e02666] transition duration-300">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}
