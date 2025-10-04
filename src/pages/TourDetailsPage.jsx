import { useParams } from "react-router-dom"
import { Footer } from "../components/layout/Footer"
import { Header } from "../components/layout/Header"
import { RelatedTours } from "../components/tours/related-tours"
import { TourDetails } from "../components/tours/tour-details"



export default function TourPage() {
    const params = useParams()
    return (
        <div className="min-h-screen">
            <Header />
            <main>
                <TourDetails tourId={params?.id} />
                <RelatedTours currentTourId={params?.id} />
            </main>
            <Footer />
        </div>
    )
}
