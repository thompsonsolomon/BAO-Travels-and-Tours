import { Header } from "../components/layout/Header"
import { PackageDetails } from "../components/travel/PackageDetails"
import { Footer } from "../components/layout/Footer"
import { RelatedPackages } from "../components/travel/RelatedPackages"
import { useParams } from "react-router-dom"


export default function TravelPackagePage() {
    const params = useParams()

    return (
        <div className="min-h-screen">
            <Header />
            <main>
                <PackageDetails packageId={params?.id} />
                <RelatedPackages currentPackageId={params?.id} />
            </main>
            <Footer />
        </div>
    )
}
