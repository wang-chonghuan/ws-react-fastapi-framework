const News = () => {
  const newsItems = [
    {
      title: "SpaceX Successfully Launches New Satellite",
      preview: "The latest mission marks another milestone in space exploration...",
    },
    {
      title: "Global Tech Conference Announces 2024 Dates",
      preview: "Leading technology companies will gather to showcase innovations...",
    },
    {
      title: "New AI Breakthrough in Medical Research",
      preview: "Scientists develop AI model that can predict patient outcomes...",
    },
    {
      title: "Electric Vehicle Sales Hit Record Numbers",
      preview: "Global EV adoption continues to rise as new models enter market...",
    },
    {
      title: "Major Climate Agreement Reached",
      preview: "World leaders commit to new environmental protection measures...",
    },
    {
      title: "Renewable Energy Investment Soars",
      preview: "Solar and wind power projects see unprecedented growth...",
    },
    {
      title: "Breakthrough in Quantum Computing",
      preview: "Researchers achieve new milestone in quantum processing...",
    },
    {
      title: "Global Internet Initiative Launches",
      preview: "Project aims to bring high-speed internet to remote areas...",
    },
    {
      title: "Tech Giants Announce Collaboration",
      preview: "Major companies join forces on next-generation AI development...",
    },
    {
      title: "Cybersecurity Summit Highlights Threats",
      preview: "Experts discuss emerging challenges in digital security...",
    },
    {
      title: "Innovation in Sustainable Transportation",
      preview: "New eco-friendly transport solutions gain traction...",
    },
    {
      title: "Digital Currency Adoption Grows",
      preview: "More countries consider implementing digital currencies...",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 mt-[--topbar-h] mb-[--bottombar-h]">
      {newsItems.map((item, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="text-md font-medium mb-2">{item.title}</h3>
          <p className="text-gray-600">{item.preview}</p>
        </div>
      ))}
    </div>
  );
};

export default News; 