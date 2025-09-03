import { getClient } from "@/lib/rpc/server";
import Image from "next/image";

type Props = {};

export async function HotelTypes({}: Props) {
  const rpcClient = await getClient();

  const hotelTypesRes = await rpcClient.api.hotels.types.$get({
    query: {
      page: "1",
      limit: "10",
    },
  });

  if (!hotelTypesRes.ok) {
    return <></>;
  }

  const hotelTypesData = await hotelTypesRes.json();

  return (
    <div className="flex items-center gap-2">
      {hotelTypesData.map((hotelType) => (
        <div className="relative w-96 h-28 rounded-md" key={hotelType.id}>
          <h3>{hotelType.name}</h3>
          <Image
            src={hotelType.thumbnail || ""}
            width={600}
            height={400}
            alt="Kidlink.com"
            className="absolute top-0 left-0 object-cover w-full h-full -z-10"
          />
        </div>
      ))}
    </div>
  );
}
