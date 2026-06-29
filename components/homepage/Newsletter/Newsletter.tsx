import React from 'react'

const Newsletter = () => {
    return (
        <section className="py-20 bg-[#badfe6]">
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
                    {/* Left content */}
                    <div className="md:w-1/2">
                        <h2 className="text-3xl md:text-[32px] font-semibold text-[#2c3138] mb-2 tracking-tight">
                            Add impact to your inbox
                        </h2>
                        <p className="text-gray-700 text-base">
                            Get our email to stay up to date
                        </p>
                    </div>

                    {/* Right Form */}
                    <div className="md:w-1/2 w-full flex justify-end">
                        <form className="relative w-full max-w-lg flex items-center">
                            <input 
                                type="email" 
                                placeholder="Email"
                                className="w-full py-4 pl-6 pr-36 rounded-full focus:outline-none focus:ring-2 focus:ring-[#75ced9] border-none text-gray-700 placeholder-gray-500 shadow-sm"
                                required
                            />
                            <button 
                                type="submit"
                                className="absolute right-0 top-0 bottom-0 bg-[#ef9a58] hover:bg-[#e08945] text-gray-800 font-medium px-8 py-4 rounded-full transition-colors shadow-sm"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Newsletter
