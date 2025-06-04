

export default function VideoSection(){

    const youtubeLink = "https://www.youtube.com/embed/tKm2-7w0U6A"
    return(
    <section className="relative mx-auto px-4 sm:px-6 lg:px-8 xl:px-36 lg:py-24">
      <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={youtubeLink}
          title="Team Collaboration Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>

    )
}