
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function Dashboard() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const data = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'Sales',
                    data: [540, 325, 702, 620],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }
            ]
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <div className="card grid grid-cols-3 justify-center p-10">
            <main className="p-10 w-full font-Inter">
                <section className="mb-10">
                    <h1 className="text-2xl font-semibold text-[#05386B] mb-4">Dashboard de Administrador</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white shadow-lg border p-5 rounded-lg">
                            <h2 className="text-lg font-bold text-[#026670]">Total de Usuarios</h2>
                            <p className="text-3xl font-bold text-[#05386B]">--</p>
                        </div>
                        <div className="bg-white shadow-lg border p-5 rounded-lg">
                            <h2 className="text-lg font-bold text-[#026670]">Total de Empresas</h2>
                            <p className="text-3xl font-bold text-[#05386B]">--</p>
                        </div>
                        <div className="bg-white shadow-lg border p-5 rounded-lg">
                            <h2 className="text-lg font-bold text-[#026670]">Total de autos</h2>
                            <p className="text-3xl font-bold text-[#05386B]">--</p>
                        </div>
                        <div className="bg-white shadow-lg border p-5 rounded-lg">
                            <h2 className="text-lg font-bold text-[#026670]">Total de servicios</h2>
                            <p className="text-3xl font-bold text-[#05386B]">--</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-[#05386B] mb-4">Estadísticas Visuales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white shadow-lg border p-5 rounded-lg">
                            <h3 className="text-lg font-bold text-[#026670] mb-4 text-center">Distribución de Usuarios</h3>
                            <Chart
                                type="bar"
                                className='h-80'
                                data={chartData} options={chartOptions} />
                            <div className="h-64 flex items-center justify-center">
                                <p className="text-gray-500">Gráfico de Distribución de Usuarios</p>
                            </div>

                        </div>
                        <div className="bg-white shadow-lg border p-5 rounded-lg h-64">
                            <h3 className="text-md font-bold text-[#026670] mb-2 text-center">Distribución de Autos</h3>
                            <Chart
                                type="bar"
                                className='h-80'
                                data={chartData} options={chartOptions} />
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">Gráfico de Distribución de Autos</p>
                            </div>
                        </div>
                        <div className="bg-white shadow-lg border p-5 rounded-lg col-span-2 h-64">
                            <h3 className="text-md font-bold text-[#026670] mb-2 text-center">Distribución de Empresas</h3>
                            <Chart
                                type="line"
                                className='h-80'
                                data={chartData} options={chartOptions} />
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">Gráfico de Distribución de Empresas</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
