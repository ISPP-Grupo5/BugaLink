import Image from 'next/image';
import { Fragment, useState } from 'react';
import miembros from '../public/assets/people/miembros.json';

export default function People() {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="py-10 md:pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {miembros.map((miembro) => (
          <Fragment key={miembro.id}>
            <div className="shadow-lg rounded-lg overflow-hidden bg-white">
              <div className="relative h-96 w-full">
                <Image
                  src={miembro.imageUrl}
                  alt={miembro.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 100vw"
                  className={`object-cover duration-700 ease-out 
										${isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100'}`}
                  onLoadingComplete={() => setLoading(false)}
                />
              </div>
              <div className="px-4 py-4">
                <h2 className="text-2xl font-bold mb-2">{miembro.name}</h2>
                <p className="text-gray-600 text-lg">{miembro.role}</p>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
