import { useState, useMemo, useEffect} from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

async function carregarDados() {
  try {
    const response = await fetch('http://localhost:3001/veiculos', {
      method: 'GET',
    });
    return await response.json();
  } catch (err) {
    console.error('Error:', err);
    return [];
  }
}

export function Component() {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    minPrice: 0,
    maxPrice: 0,
    minYear: 0,
    maxYear: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await carregarDados();
      setCars(data); // Atualiza o estado com os dados carregados
    };
    fetchData();
  }, []); // [] garante que o efeito só será executado uma vez, após a montagem do componente

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      return (
        (filters.brand === "" || car.brand.toLowerCase().includes(filters.brand.toLowerCase())) &&
        (filters.model === "" || car.model.toLowerCase().includes(filters.model.toLowerCase())) &&
        (filters.minPrice === 0 || car.price >= filters.minPrice) &&
        (filters.maxPrice === 0 || car.price <= filters.maxPrice)
      );
    });
  }, [filters, cars]);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  return (
    <div className="bg-primary-foreground flex flex-col h-full">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <h1 className="text-2xl font-bold flex items-center gap-4">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg">
            <path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z"></path>
          </svg>
          DGI Motors
        </h1>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div className="bg-background rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold mb-2">Filtros</h2>
          <div className="grid gap-4">
            <div>
              <label htmlFor="model" className="block text-sm font-medium mb-1">
                Modelo
              </label>
              <Input
                id="model"
                type="text"
                value={filters.model}
                onChange={(e) => handleFilterChange("model", e.target.value)}
                placeholder="Pesquisar por modelo" />
            </div>
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium mb-1">
                Preço Mínimo
              </label>
              <Input
                id="minPrice"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", Number(e.target.value))}
                placeholder="Preço mínimo" />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium mb-1">
                Preço Máximo
              </label>
              <Input
                id="maxPrice"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))}
                placeholder="Preço máximo" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:col-span-2 gap-6">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-background w-full rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={car.image || "/placeholder.svg"}
                alt={`${car.brand} ${car.model}`}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
                style={{ aspectRatio: "400/300", objectFit: "cover" }}
              />
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">
                  {car.brand} {car.model}
                </h3>
                <p className="text-xl font-bold mb-4">R$ {car.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}