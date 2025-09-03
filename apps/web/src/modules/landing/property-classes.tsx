import { getClient } from "@/lib/rpc/server";
import Image from "next/image";

type Props = {};

export async function PropertyClasses({}: Props) {
  const rpcClient = await getClient();

  const propertyClassesRes = await rpcClient.api["property-classes"].$get({
    query: {
      page: "1",
      limit: "10",
    },
  });

  if (!propertyClassesRes.ok) {
    return <></>;
  }

  const propertyClasses = await propertyClassesRes.json();

  return (
    <div className="flex items-center gap-2">
      {propertyClasses.map((propertyClass) => (
        <div className="relative w-96 h-28 rounded-md" key={propertyClass.id}>
          <h3>{propertyClass.name}</h3>
          <Image
            src={propertyClass.thumbnail || ""}
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
