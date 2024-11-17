import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { useAuth } from '../../../AuthContext';
import { EstadisticaService } from '../../../services/estadisticas/EstadisticasService';

export default function Dashboard() {
    const [estadisticasData, setEstadisticasData] = useState({});
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const { user, userRole, token } = useAuth();
    const estadisticaService = new EstadisticaService();

    useEffect(() => {
        estadisticaService.getEstadisticasByUser(token).then((data) => {
            if (data.success) {
                setEstadisticasData(data.data);
            }
        }).catch((error) => {
            console.error('Error fetching estadisticas:', error);
        });
    }, [token]);

    const getCardData = () => {
        switch (userRole) {
            case "Admin":
                return [
                    { title: "Total de Usuarios", value: estadisticasData.totalDeUsuarios },
                    { title: "Total de Edificios", value: estadisticasData.totalDeEdificios },
                    { title: "Total de Habitaciones", value: estadisticasData.totalDeHabitaciones },
                ];
            case "Dueño":
                return [
                    { title: "Total de Encargados", value: estadisticasData.totalDeEncargados },
                    { title: "Total de Inquilinos", value: estadisticasData.totalDeInquilinos },
                    { title: "Total de Contratos Activos", value: estadisticasData.totalDeContratosActivos },
                    { title: "Total de Ingresos", value: `$ ${estadisticasData.totalDeIngresos}`, color: 'green' },
                    { title: "Total de Gastos", value: `-$ ${estadisticasData.totalDeGastos}`, color: 'red' }
                ];
            case "Encargado":
                return [
                    { title: "Total de Inquilinos", value: estadisticasData.totalDeInquilinos },
                    { title: "Habitaciones disponibles", value: estadisticasData.totalDeHabitacionesDisponibles },
                    { title: "Mantenimientos Pendientes", value: estadisticasData.mantenimientosPendientes },
                    { title: "Mantenimientos En proceso", value: estadisticasData.mantenimientosEnProceso },
                    { title: "Total de Mantenimientos Finalizados", value: estadisticasData.mantenimientosFinalizados },
                ];
            default:
                return [];
        };
    }

    const getChartData = () => {
        switch (userRole) {
            case "Admin":
                return {
                    labels: ['Usuarios', 'Edificios', 'Habitaciones'],
                    datasets: [
                        {
                            label: 'Estadísticas Admin',
                            data: [estadisticasData.totalDeUsuarios, estadisticasData.totalDeEdificios, estadisticasData.totalDeHabitaciones],
                            backgroundColor: ['#4caf50', '#2196f3', '#ffeb3b'],
                        }
                    ]
                };
            case "Dueño":
                return {
                    labels: ['Encargados', 'Inquilinos', 'Contratos Activos', 'Ingresos', 'Gastos'],
                    datasets: [
                        {
                            label: 'Estadísticas Dueño',
                            data: [
                                estadisticasData.totalDeEncargados,
                                estadisticasData.totalDeInquilinos,
                                estadisticasData.totalDeContratosActivos,
                                estadisticasData.totalDeIngresos,
                                estadisticasData.totalDeGastos
                            ],
                            backgroundColor: ['#ff9800', '#8bc34a', '#009688', '#4caf50', '#f44336'],
                        }
                    ]
                };
            case "Encargado":
                return {
                    labels: ['Inquilinos', 'Habitaciones Disponibles', 'Mantenimientos Pendientes', 'Mantenimientos En Proceso', 'Mantenimientos Finalizados'],
                    datasets: [
                        {
                            label: 'Estadísticas Encargado',
                            data: [
                                estadisticasData.totalDeInquilinos,
                                estadisticasData.totalDeHabitacionesDisponibles,
                                estadisticasData.mantenimientosPendientes,
                                estadisticasData.mantenimientosEnProceso,
                                estadisticasData.mantenimientosFinalizados
                            ],
                            backgroundColor: ['#3f51b5', '#f44336', '#9c27b0', '#ff9800', '#4caf50'],
                        }
                    ]
                };
            default:
                return {};
        }
    }



    return (
        <div className="card grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center p-10">
            <main className="p-10 w-full font-Inter">
                <section className="mb-10">
                    <h1 className="text-2xl font-semibold text-[#05386B] mb-4">
                        Dashboard de {userRole === "Admin" ? "Administrador" : userRole}
                    </h1>
                    <div className="grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {getCardData().map((card, index) => (
                            <div key={index} className="bg-white shadow-lg border p-5 rounded-lg">
                                <h2 className="text-lg font-bold text-[#026670]">{card.title}</h2>
                                <p className={`text-3xl font-bold ${card.color === 'red' ? 'text-red-500' : card.color === 'green' ? 'text-green-500' : 'text-[#05386B]'}`}>{card.value}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-[#05386B] mb-4">Gráficas de {userRole}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <Chart type="pie" data={getChartData()} options={chartOptions} />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
