export default function Card(){
    return(
        <a href='#' className='scale-90 -translate-x-2 snap-center shrink-0 block shadow bg-turquoise rounded-2xl hover:bg-gray-100' >
          <span className="bg-white relative rounded-2xl shadow-lg">
              <div className='absolute right-0 z-10 text-right text-ellipsis'>
                <p className='text-sm inline-block align-top bg-turquoise text-white rounded-bl-xl rounded-tr-xl p-1'> COMO PASAJERO</p>
              </div>
              
              <span className='bg-white grid grid-cols-3 place-items-center pt-2 rounded-2xl overflow-hidden'>
                <div className='text-right text-ellipsis'>
                  <img src="/icons/Vista-Principal/hombre.png" className='object-scale-down h-20 w-20'/>
                </div>

                <div className='text-left text-ellipsis'>
                  <p className='text-sm text-black'>1234ABC</p>
                  <p className='text-sm text-gray'>Tesla Model S</p>
                  <p className='text-xs text-gray'> María Teresa Romero</p>
                </div>

                <img src="/icons/Vista-Principal/car.svg" className='place-self-end scale-100'/>
              </span>
          </span>        
           
          <span className='grid grid-cols-2 rounded-b-2xl px-2 py-1 pl-3.5 pt-3'>
            <div className='text-left text-ellipsis text-white text-xs mr-5'>
              <p>Origen</p>
              <img src="/icons/Vista-Principal/origen.svg" className='float-left pt-2.5'/>
              <p className="pl-4 pt-2">Calle Nuestra Señor...</p>
            </div>

            <div className='text-left text-ellipsis text-white text-xs'>
              <p>Destino</p>
              <img src="/icons/Vista-Principal/destino.svg" className='float-left pt-2'/>
              <p className="pl-4 pt-2">Avda. Reina Mercedes, 35</p>
            </div>

            <div className='text-left text-ellipsis text-white text-xs pt-3'>
              <p>Fecha</p>
              <p className="pt-2">📅 Miércoles 14 de febrero, 16:45</p>
            </div>

            <div className='text-right text-ellipsis text-white text-lg pt-3'>
              <p className="pt-2">2,00€</p>
            </div>
          </span>     
        </a>        
    );
}