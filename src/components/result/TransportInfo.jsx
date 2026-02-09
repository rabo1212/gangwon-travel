import { Car, Bus, MapPin, Navigation, Footprints, ParkingCircle } from "lucide-react";

export default function TransportInfo({ transportInfo, travelMode }) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#00A86B] text-white flex items-center justify-center">
          {travelMode === "자차" ? <Car className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
        </div>
        <h2 className="text-xl font-bold text-[#1A1A2E]">
          {travelMode === "자차" ? "운전 정보" : "대중교통 정보"}
        </h2>
      </div>

      <div className="space-y-3">
        {transportInfo.map((ti, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1A1A2E] mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0066CC]" /> {ti.region}
            </h3>
            {ti.info.type === "car" ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Navigation className="w-4 h-4 text-[#00A86B]" /> {ti.info.driveTime}
                </div>
                {ti.info.parking && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ParkingCircle className="w-4 h-4 text-blue-500" /> {ti.info.parking}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Bus className="w-4 h-4 text-[#0066CC] mt-0.5 shrink-0" />
                  <div><span className="font-medium text-gray-700">시외버스:</span> {ti.info.intercity}</div>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Footprints className="w-4 h-4 text-[#00A86B] mt-0.5 shrink-0" />
                  <div><span className="font-medium text-gray-700">시내버스:</span> {ti.info.local}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
