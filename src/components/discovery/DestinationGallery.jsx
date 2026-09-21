function DestinationGallery({ images }) {
  if (!Array.isArray(images) || images.length === 0) return null;

  return (
    <section className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-3xl font-bold mb-5">📸 Destination Gallery</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {images.map((image, index) => (
          <div key={image + index} className="overflow-hidden rounded-xl shadow-lg">
            <img
              src={image}
              alt={"Destination view " + (index + 1)}
              loading="lazy"
              className="w-full h-60 object-cover hover:scale-105 duration-300 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default DestinationGallery;
