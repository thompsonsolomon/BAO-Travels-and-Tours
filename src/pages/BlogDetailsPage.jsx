import { useParams } from "react-router-dom"
import { Footer } from "../components/layout/Footer"
import { Header } from "../components/layout/Header"
import BlogDetail from "../components/Blog/Blogdetails"



export default function BlogDetailsPage() {
    const params = useParams()
    return (
        <div className="min-h-screen">
            <Header />
            <main>
               <BlogDetail params={params.id} />
            </main>
            <Footer />
        </div>
    )
}
