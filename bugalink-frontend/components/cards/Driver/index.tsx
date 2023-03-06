
export default function DriverCard(){
    return(
        <a href='#' className='scale-90 -translate-x-2 snap-center shrink-0 block shadow bg-green rounded-2xl hover:bg-gray-100' >
          <span className="bg-white relative rounded-2xl shadow-lg">
              <div className='absolute right-0 z-10 text-right text-ellipsis'>
                <p className='text-sm inline-block align-top bg-green text-white rounded-bl-xl rounded-tr-xl p-1'> COMO CONDUCTOR</p>
              </div>
              
              <span className='bg-white h-35 grid grid-cols-3 place-items-center pt-2 pb-2 rounded-2xl overflow-hidden'>
                <div className='relative place-self-center text-ellipsis scale-90'>
                  
                  <img src="/icons/Vista-Principal/hombre.png" className='object-scale-down h-20 w-20 '/>
                  <img src="/icons/Vista-Principal/hombre.png" className='object-scale-down h-20 w-20 absolute right-3 top-0 z-10 '/>
                  <img src="/icons/Vista-Principal/hombre.png" className='object-scale-down h-20 w-20 absolute right-6 top-0 z-20 '/>
                  
                </div>

                <div className='text-left text-ellipsis'>
                  <p className='text-sm text-gray'>Pasajeros</p>
                  <p className='text-sm text-black'>Juan Blanco y 2 más...</p>
                </div>

                <img src="/icons/Vista-Principal/passanger.svg" className='absolute -right-6 -bottom-8'/>
              </span>
          </span>        
           
          <span className='grid grid-cols-2 rounded-b-2xl px-2 py-1 pl-3.5 pt-3'>
            <div className='text-left text-ellipsis text-white text-xs mr-5'>
              <p>Origen</p>
              <img src="/icons/Vista-Principal/origen.svg" className='float-left pt-2.5'/>
              <p className="pl-4 pt-2">Plaza de Armas</p>
            </div>

            <div className='text-left text-ellipsis text-white text-xs'>
              <p>Destino</p>
              <img src="/icons/Vista-Principal/destino.svg" className='float-left pt-2'/>
              <p className="pl-4 pt-2">Centro Comercial Lagoh</p>
            </div>

            <div className='text-left text-ellipsis text-white text-xs pt-3'>
              <p>Fecha</p>
              <p className="pt-2">📅 Jueves 15 de febrero, 8:00</p>
            </div>

            <div className='text-right text-ellipsis text-white text-lg pt-3'>
              <p className="pt-2">1,00€/pasajero</p>
            </div>
          </span>     
        </a>        
    );
}