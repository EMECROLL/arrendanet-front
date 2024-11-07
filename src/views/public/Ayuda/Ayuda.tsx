import { Avatar } from 'primereact/avatar'
import React, { useState } from 'react'

export default function Ayuda() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Maneja el cambio en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulamos un retraso al enviar los datos
    setTimeout(() => {
      setIsSubmitting(false);
      alert('¡Mensaje enviado con éxito!');
    }, 2000);

    // Aquí se podría integrar una función para enviar los datos al servidor
  };

  return (
    <main>
      <section className="flex flex-col justify-center p-10">
        <h1 className="font-Nunito text-4xl text-center font-bold text-navy my-0">¡Estamos aquí para ayudarte!</h1>
        <h2 className="text-navy font-Nunito text-xl font-light text-center my-0 w-10/12 mx-auto">Un equipo de soporte listo para responder cualquier pregunta o consulta que puedas tener.</h2>
      </section>


      <section className='grid grid-cols-2 gap-10'>
        <div id="contacto" className="bg-gray-100 py-8">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-center text-blue-600">¡Estamos aquí para ayudarte!</h2>
            <p className="text-center text-gray-600 mt-4">
              Si tienes alguna duda, inquietud o comentario, por favor rellena el siguiente formulario y nos pondremos en contacto contigo lo antes posible.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre Completo */}
                <div className="flex flex-col">
                  <label htmlFor="nombre" className="text-lg font-medium text-gray-700">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>

                {/* Correo Electrónico */}
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-lg font-medium text-gray-700">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Tu correo electrónico"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                {/* Teléfono */}
                <label htmlFor="telefono" className="text-lg font-medium text-gray-700">
                  Teléfono (Opcional)
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Tu número de teléfono"
                />
              </div>

              <div className="flex flex-col">
                {/* Asunto */}
                <label htmlFor="asunto" className="text-lg font-medium text-gray-700">
                  Asunto
                </label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  required
                  value={formData.asunto}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Tema o motivo de contacto"
                />
              </div>

              <div className="flex flex-col">
                {/* Mensaje */}
                <label htmlFor="mensaje" className="text-lg font-medium text-gray-700">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  value={formData.mensaje}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  rows={6}
                  placeholder="Escribe tu mensaje aquí"
                />
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Recuerda que los datos que nos proporcionas serán tratados de acuerdo a nuestra{' '}
                <a href="/politica-de-privacidad" className="text-blue-600 hover:underline">
                  Política de Privacidad
                </a>.
              </p>
            </div>
          </div>
        </div>

        <div className='w-1/2 mx-auto'>
          <div className="flex flex-col justify-center text-center">
            <h1 className="font-Nunito text-xl atext-center font-bold text-navy my-0">¿Prefieres contactarnos directamente?</h1>
            <div className="flex justify-center flex-col space-y-3  mx-auto">
              <h1>Dirección: <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit vel ullam debitis corporis expedita esse architecto eius aspernatur ex, id aut fugiat velit quibusdam, nostrum ducimus? Ullam inventore labore aut.</span></h1>
              <h1>Teléfono: <span>998XXXXXXX.</span></h1>
              <h1>Correo Electrónico: <span>TirandoScript@gmail.com</span></h1>
              <h1>Horario de Atención:<span>Lunes a Viernes: 9:00 AM - 6:00 PM
                Sábados: 10:00 AM - 2:00 PM</span></h1>
            </div>
          </div>

          <div className="flex flex-col justify-center text-center">
            <h1 className="font-Nunito text-xl atext-center font-bold text-navy my-0">Conéctate con nosotros a través de nuestras redes sociales</h1>
            <div className="flex justify-center space-x-5 mx-auto">
              <Avatar icon="pi pi-facebook" size="large" shape="circle" className="bg-navy border-2 border-white text-white" />
              <Avatar icon="pi pi-instagram" size="large" shape="circle" className="bg-navy border-2 border-white text-white" />
              <Avatar icon="pi pi-youtube" size="large" shape="circle" className="bg-navy border-2 border-white text-white" />
              <Avatar icon="pi pi-whatsapp" size="large" shape="circle" className="bg-navy border-2 border-white text-white" />
            </div>
          </div>


          <div className="flex flex-col justify-center p-10 space-y-5">
            <h1 className="font-Nunito text-4xl text-center font-bold text-navy my-0">Encuentra nuestra ubicación</h1>
            <img className='w-1/2 mx-auto' src="/src/assets/images/mapa.png" alt="Nuestra ubicación" />
          </div>
        </div>
      </section>
    </main>
  )
}
