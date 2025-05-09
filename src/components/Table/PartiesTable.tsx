// @ts-nocheck



const PartiesTable = () => {
    return (
        <section className="min-h-screen   text-white p-8">
            <div className="overflow-x-auto">
                <table className="min-w-full   text-sm rounded-lg overflow-hidden">
                    <thead className="bg-[#14243452] text-white">
                        <tr>
                            <th className="px-4 py-3  ">Full Name</th>
                            <th className="px-4 py-3  ">Email</th>
                            <th className="px-4 py-3  ">Phone No.</th>
                            <th className="px-4 py-3  ">Type</th>
                            <th className="px-4 py-3  ">Company Name</th>
                            <th className="px-4 py-3  ">GST No.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            {
                                name: "Rahul Sharma",
                                email: "rahul.sharma@example.com",
                                phone: "9876543210",
                                type: "Private",
                                company: "Sharma Enterprises",
                                gst: "29ABCDE1234F1Z5",
                            },
                            {
                                name: "Pooja Verma",
                                email: "pooja.verma@example.com",
                                phone: "9123456780",
                                type: "Proprietor",
                                company: "Verma Traders",
                                gst: "07AAACV1234Q1Z3",
                            },
                            {
                                name: "Arjun Mehta",
                                email: "arjun.mehta@example.com",
                                phone: "9012345678",
                                type: "LLP",
                                company: "Mehta & Co",
                                gst: "24BBCCM4567L1Z2",
                            },
                            {
                                name: "Simran Kaur",
                                email: "simran.kaur@example.com",
                                phone: "9988776655",
                                type: "Startup",
                                company: "Kaur Technologies",
                                gst: "27AACCS7890E1Z9",
                            },
                        ].map((party, index) => (
                            <tr
                                key={index}
                                className={`${index % 2 === 0 ? "bg-[#ffffff40]" : "bg-[#ffffff1f]"
                                    } hover:bg-[#ffffff78] transition-colors`}
                            >
                                <td className="px-4 py-4 text-gray-200 ">
                                    {party.name}
                                </td>
                                <td className="px-4 py-4 text-gray-200 ">
                                    {party.email}
                                </td>
                                <td className="px-4 py-4 text-gray-200 ">
                                    {party.phone}
                                </td>
                                <td className="px-4 py-4 text-gray-200 ">
                                    {party.type}
                                </td>
                                <td className="px-4 py-4  text-gray-200">
                                    {party.company}
                                </td>
                                <td className="px-4 py-4 text-gray-200 ">
                                    {party.gst}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default PartiesTable