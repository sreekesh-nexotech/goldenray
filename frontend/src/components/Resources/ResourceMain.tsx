import { heroPosts, mockBlogs, selectedCategory } from "@/data/Mock-Resources";
import Hero from "../ui/Hero";
import ResourceHero from "@/components/Resources/ResourceHero";
import RecentlyAdded from "@/components/Resources/RecentlyAdded";
import PopularPosts from "@/components/Resources/PopularPost";
import CategoryBlogs from "@/components/Resources/CategoryBlogs";
import SolarAdvantageMain from "@/components/SolarCalculator/SolarAdvantageMain";

export default function ResourceMain(){
    return(
        <section className="relative mb-10">
            {/* Hero section */}
            <Hero title="Blog Hub" description="Explore guides, tips, and tools to make your solar journey easy and efficient."/>
            {/* Hero content left side first post of heropost data and remaining on right */}
            {/* <ResourceHero posts={heroPosts}/> */}

            {/* Recently added blogs */}
            <RecentlyAdded posts={mockBlogs}/>

            {/* PopularPost */}
            {/* <PopularPosts posts={mockBlogs}/> */}

            {/* Category Blogs (solar life style for now) */}
            {/* <CategoryBlogs posts={mockBlogs} selectedCategory={selectedCategory}/> */}

            {/* Solar advantage */}
            {/* <SolarAdvantageMain/> */}
        </section>
    )
}