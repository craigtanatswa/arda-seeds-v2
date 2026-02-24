import { notFound } from 'next/navigation';
import { sorghumProducts } from '@/lib/product-data';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { Wheat } from 'lucide-react';

interface ProductPageProps {
  params: { id: string };
}

export default function SorghumProductPage({ params }: ProductPageProps) {
  const product = sorghumProducts.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb Navigation */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-700">Home</Link> / 
        <Link href="/products" className="hover:text-green-700 ml-1">Products</Link> / 
        <Link href="/products/sorghum" className="hover:text-green-700 ml-1">Sorghum</Link> / 
        <span className="text-gray-900 ml-1">{product.name}</span>
      </div>

      {/* Back Button */}
      <Link 
        href="/products/sorghum" 
        className="inline-flex items-center text-green-700 mb-6 hover:text-green-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sorghum Products
      </Link>

      {/* Product Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative h-96 rounded-xl overflow-hidden border border-gray-200">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.featured && <Badge className="bg-green-700">Featured</Badge>}
          </div>
          
          <p className="text-gray-700 mb-6">{product.fullDescription}</p>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Key Features</h2>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 p-3 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-1">Maturity Period</h3>
              <p className="text-gray-700">{product.maturity}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-1">Yield Potential</h3>
              <p className="text-gray-700">{product.yieldPotential}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-1">Suitable Regions</h3>
              <p className="text-gray-700">{product.regions.join(', ')}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-1">Category</h3>
              <p className="text-gray-700 capitalize">{product.category}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link
              href={`/order?product=${product.id}`}
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition-colors text-center"
            >
              Order Seed
            </Link>
            <Link
              href="/contact"
              className="border-2 border-green-700 text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors text-center"
            >
              Contact Sales Team
            </Link>            
          </div>
        </div>
      </div>

      {/* Sorghum-Specific Growing Recommendations */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Sorghum Growing Recommendations</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Planting Guidelines for Sorghum</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Optimal planting time: November to December</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Planting depth: 2-5 cm (shallower in heavy soils)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Row spacing: 60-90 cm between rows, 10-15 cm within rows</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Seeding rate: 5-10 kg/ha depending on variety</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Plant population: 70,000-150,000 plants per hectare</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Soil & Fertilizer Requirements</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Adaptable to various soils but prefers well-drained loams</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Ideal soil pH: 5.5-8.5 (tolerates alkaline soils)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Basal fertilizer: Compound D (200-300 kg/ha) at planting</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Top dressing: Ammonium nitrate (150-200 kg/ha) at knee-high stage</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Responds well to nitrogen but excessive N can cause lodging</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 bg-green-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Harvest & Post-Harvest</h3>
          <ul className="space-y-2 text-gray-700 grid md:grid-cols-2 gap-4">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Harvest when grain moisture content is 20-25%</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Harvest by cutting heads or combine harvesting</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Dry to 12-13% moisture for storage</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Store in clean, dry conditions to prevent mold and insect damage</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Stalks can be used as fodder or for construction</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Pest and Disease Management */}
      <div className="mt-8 bg-green-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">Pest and Disease Management</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2 text-green-700">Common Pests:</h4>
            <ul className="space-y-1 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Sorghum shoot fly</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Stem borers</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Birds (particularly at milky stage)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Aphids</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-green-700">Common Diseases:</h4>
            <ul className="space-y-1 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Anthracnose</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Leaf blight</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Grain mold</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Downy mildew</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Other Sorghum Varieties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorghumProducts
            .filter(p => p.id !== product.id)
            .map(relatedProduct => (
              <Link 
                key={relatedProduct.id}
                href={`/products/sorghum/${relatedProduct.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <img 
                    src={relatedProduct.image} 
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{relatedProduct.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{relatedProduct.shortDescription}</p>
                  <div className="mt-2 flex items-center text-green-600">
                    <Wheat className="h-4 w-4 mr-1" />
                    <span className="text-sm">Regions: {relatedProduct.regions.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  );
}
