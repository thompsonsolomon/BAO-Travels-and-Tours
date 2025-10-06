import { Header } from "../components/layout/Header"
import { Footer } from "../components/layout/Footer"
import Blogs from "../components/Blog/Blog"

export default function BlogPage() {
    return (
        <div className="min-h-screen">
            <Header />
            <main>
               <Blogs />
            </main>
            <Footer />
        </div>
    )
}
