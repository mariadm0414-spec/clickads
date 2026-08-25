"use client";

import React from "react";
import { Check, Truck, CreditCard, MessageCircle, Phone, Instagram, ShieldCheck, Ruler, CheckCircle2 } from "lucide-react";

export default function CatalogoPage() {
    return (
        <div className="catalogo-wrapper">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
                
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                .catalogo-wrapper {
                    background-color: #e6e3df; /* Outer background */
                    min-height: 100vh;
                    padding: 20px;
                    font-family: 'Montserrat', sans-serif;
                    color: #2b2b2b;
                }

                .catalogo-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background-color: #dfdbd4; /* Gap color (borders) */
                    border: 10px solid #dfdbd4;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .grid-row-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }

                .card {
                    background-color: #f3efe9;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                /* Cover Card Styles */
                .cover-card {
                    justify-content: space-between;
                }
                .cover-top {
                    text-align: center;
                    padding: 40px 20px;
                }
                .cover-logo-mark {
                    font-size: 56px;
                    font-family: serif;
                    line-height: 1;
                    margin-bottom: 5px;
                    letter-spacing: -2px;
                }
                .cover-logo-text {
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: 2px;
                }
                .cover-subtitle {
                    font-size: 11px;
                    letter-spacing: 3px;
                    margin-top: 8px;
                    color: #555;
                }
                .cover-image-container {
                    flex: 1;
                    position: relative;
                    min-height: 350px;
                    width: 100%;
                    overflow: hidden;
                }
                .cover-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .cover-overlay-text {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 60px 20px 20px;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                    color: #fff;
                    text-align: center;
                }
                .cover-overlay-title {
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    margin-bottom: 8px;
                }
                .cover-overlay-subtitle {
                    font-size: 12px;
                    letter-spacing: 1px;
                    font-weight: 500;
                }
                .cover-bottom {
                    background-color: #2b2b2b;
                    color: #fff;
                    display: flex;
                    justify-content: space-around;
                    padding: 20px;
                    font-size: 13px;
                    font-weight: 500;
                }
                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* Product Card Styles */
                .product-card {
                    display: flex;
                    flex-direction: column;
                }
                .product-content {
                    display: flex;
                    flex: 1;
                    padding: 30px;
                    gap: 20px;
                }
                .product-info {
                    flex: 0 0 38%;
                    display: flex;
                    flex-direction: column;
                }
                .product-images {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .product-number {
                    font-weight: 800;
                    font-size: 14px;
                    margin-bottom: 4px;
                }
                .product-title {
                    font-size: 20px;
                    font-weight: 800;
                    line-height: 1.2;
                    margin-bottom: 24px;
                }
                .product-medidas {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    font-size: 11px;
                    font-weight: 600;
                    margin-bottom: 24px;
                }
                .product-medidas span {
                    line-height: 1.4;
                }
                .colores-title {
                    font-size: 11px;
                    font-weight: 700;
                    margin-bottom: 8px;
                }
                .colores-swatches {
                    display: flex;
                    gap: 6px;
                    margin-bottom: 24px;
                }
                .swatch {
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    border: 1px solid rgba(0,0,0,0.1);
                }
                .features-list {
                    list-style: none;
                    margin-bottom: auto;
                }
                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 11px;
                    margin-bottom: 10px;
                    font-weight: 500;
                }
                .price-tag {
                    background-color: #d8d0c5;
                    padding: 12px 20px;
                    display: inline-block;
                    font-size: 22px;
                    font-weight: 700;
                    align-self: flex-start;
                    margin-top: 20px;
                }
                
                .img-main {
                    width: 100%;
                    height: 220px;
                    object-fit: cover;
                }
                .img-sub-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    height: 120px;
                }
                .img-sub {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .card-bottom-action {
                    border-top: 1px solid #dfdbd4;
                    padding: 15px;
                    text-align: center;
                    font-size: 12px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    color: #444;
                }

                /* Footer Features */
                .footer-features {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    background-color: #f3efe9;
                    padding: 40px 20px;
                    gap: 20px;
                }
                .feature-box {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .feature-box-icon {
                    flex-shrink: 0;
                }
                .feature-box-text h4 {
                    font-size: 12px;
                    font-weight: 800;
                    margin-bottom: 4px;
                }
                .feature-box-text p {
                    font-size: 10px;
                    color: #555;
                    line-height: 1.4;
                }

                /* Footer Black Bar */
                .footer-black-bar {
                    background-color: #2b2b2b;
                    color: #fff;
                    padding: 25px 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .footer-cta {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .footer-cta h3 {
                    font-size: 16px;
                    font-weight: 700;
                    letter-spacing: 1px;
                }
                .footer-cta p {
                    font-size: 12px;
                    color: #ccc;
                    margin-top: 4px;
                }
                .footer-logo {
                    text-align: right;
                }
                .footer-logo-mark {
                    font-size: 32px;
                    font-family: serif;
                    line-height: 1;
                }
                .footer-logo-text {
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 2px;
                }

                /* Responsive and Print */
                @media (max-width: 900px) {
                    .grid-row-2 {
                        grid-template-columns: 1fr;
                    }
                    .footer-features {
                        grid-template-columns: 1fr 1fr;
                    }
                    .footer-black-bar {
                        flex-direction: column;
                        gap: 20px;
                        text-align: center;
                    }
                }
                
                @media (max-width: 600px) {
                    .product-content {
                        flex-direction: column;
                    }
                    .footer-features {
                        grid-template-columns: 1fr;
                    }
                }

                @media print {
                    @page {
                        margin: 0;
                        size: A4 portrait;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        background-color: white;
                    }
                    .catalogo-wrapper {
                        padding: 0;
                        background: none;
                    }
                    .catalogo-container {
                        max-width: 100%;
                        border: none;
                        gap: 5mm;
                        background-color: #dfdbd4;
                    }
                    .grid-row-2 {
                        grid-template-columns: 1fr 1fr; /* Force 2 cols on print */
                        gap: 5mm;
                    }
                    .card {
                        break-inside: avoid;
                    }
                    .footer-features {
                        grid-template-columns: repeat(4, 1fr);
                        break-inside: avoid;
                    }
                    .footer-black-bar {
                        break-inside: avoid;
                    }
                }
            `}</style>

            <div className="catalogo-container">
                
                {/* ROW 1 */}
                <div className="grid-row-2">
                    {/* Cover */}
                    <div className="card cover-card">
                        <div className="cover-top">
                            <div className="cover-logo-mark">H L</div>
                            <div className="cover-logo-text">HOME LIVING</div>
                            <div className="cover-subtitle">DISEÑO · CONFORT · CALIDAD</div>
                        </div>
                        <div className="cover-image-container">
                            <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop" alt="Portada Sillones" className="cover-image" />
                            <div className="cover-overlay-text">
                                <div className="cover-overlay-title">CATÁLOGO 2026</div>
                                <div className="cover-overlay-subtitle">SILLONES QUE TRANSFORMAN TU HOGAR</div>
                            </div>
                        </div>
                        <div className="cover-bottom">
                            <div className="contact-item">
                                <Phone size={16} /> 11 1234 5678
                            </div>
                            <div className="contact-item">
                                <Instagram size={16} /> @homeliving.ok
                            </div>
                        </div>
                    </div>

                    {/* Product 01 */}
                    <div className="card product-card">
                        <div className="product-content">
                            <div className="product-info">
                                <div className="product-number">01.</div>
                                <div className="product-title">SOFÁ<br/>ESQUINERO<br/>MILÁN</div>
                                
                                <div className="product-medidas">
                                    <Ruler size={16} />
                                    <span>Medidas:<br/>2,40 x 1,60 m</span>
                                </div>

                                <div className="colores-title">Colores disponibles:</div>
                                <div className="colores-swatches">
                                    <div className="swatch" style={{background: '#e0d8c8'}}></div>
                                    <div className="swatch" style={{background: '#a8a29a'}}></div>
                                    <div className="swatch" style={{background: '#635e58'}}></div>
                                    <div className="swatch" style={{background: '#8c7a6b'}}></div>
                                </div>

                                <ul className="features-list">
                                    <li className="feature-item"><Check size={14} /> Tela antimanchas</li>
                                    <li className="feature-item"><Check size={14} /> Almohadones desmontables</li>
                                    <li className="feature-item"><Check size={14} /> Estructura de madera maciza</li>
                                    <li className="feature-item"><Check size={14} /> Fabricación nacional</li>
                                </ul>

                                <div className="price-tag">$28.900</div>
                            </div>
                            <div className="product-images">
                                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop" alt="Milán Main" className="img-main" />
                                <div className="img-sub-row">
                                    <img src="https://images.unsplash.com/photo-1512212621149-107ffe572d2f?q=80&w=400&auto=format&fit=crop" alt="Milán Detalle 1" className="img-sub" />
                                    <img src="https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=400&auto=format&fit=crop" alt="Milán Detalle 2" className="img-sub" />
                                </div>
                            </div>
                        </div>
                        <div className="card-bottom-action">
                            <MessageCircle size={16} /> Consultas por WhatsApp
                        </div>
                    </div>
                </div>

                {/* ROW 2 */}
                <div className="grid-row-2">
                    {/* Product 02 */}
                    <div className="card product-card">
                        <div className="product-content">
                            <div className="product-info">
                                <div className="product-number">02.</div>
                                <div className="product-title">SOFÁ 3 CUERPOS<br/>VENECIA</div>
                                
                                <div className="product-medidas">
                                    <Ruler size={16} />
                                    <span>Medidas:<br/>2,10 m</span>
                                </div>

                                <div className="colores-title">Colores disponibles:</div>
                                <div className="colores-swatches">
                                    <div className="swatch" style={{background: '#e0d8c8'}}></div>
                                    <div className="swatch" style={{background: '#a8a29a'}}></div>
                                    <div className="swatch" style={{background: '#635e58'}}></div>
                                    <div className="swatch" style={{background: '#8c7a6b'}}></div>
                                </div>

                                <ul className="features-list">
                                    <li className="feature-item"><Check size={14} /> Tela antimanchas</li>
                                    <li className="feature-item"><Check size={14} /> Almohadones desmontables</li>
                                    <li className="feature-item"><Check size={14} /> Patas de madera maciza</li>
                                    <li className="feature-item"><Check size={14} /> Fabricación nacional</li>
                                </ul>

                                <div className="price-tag">$24.900</div>
                            </div>
                            <div className="product-images">
                                <img src="https://images.unsplash.com/photo-1540574163026-643ea20d25b5?q=80&w=600&auto=format&fit=crop" alt="Venecia Main" className="img-main" />
                                <div className="img-sub-row">
                                    <img src="https://images.unsplash.com/photo-1567016432779-094069806efa?q=80&w=400&auto=format&fit=crop" alt="Venecia Detalle 1" className="img-sub" />
                                    <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=400&auto=format&fit=crop" alt="Venecia Detalle 2" className="img-sub" />
                                </div>
                            </div>
                        </div>
                        <div className="card-bottom-action">
                            <MessageCircle size={16} /> Consultas por WhatsApp
                        </div>
                    </div>

                    {/* Product 03 */}
                    <div className="card product-card">
                        <div className="product-content">
                            <div className="product-info">
                                <div className="product-number">03.</div>
                                <div className="product-title">SOFÁ 2 CUERPOS<br/>LONDRES</div>
                                
                                <div className="product-medidas">
                                    <Ruler size={16} />
                                    <span>Medidas:<br/>1,60 m</span>
                                </div>

                                <div className="colores-title">Colores disponibles:</div>
                                <div className="colores-swatches">
                                    <div className="swatch" style={{background: '#e0d8c8'}}></div>
                                    <div className="swatch" style={{background: '#a8a29a'}}></div>
                                    <div className="swatch" style={{background: '#635e58'}}></div>
                                </div>

                                <ul className="features-list">
                                    <li className="feature-item"><Check size={14} /> Tela antimanchas</li>
                                    <li className="feature-item"><Check size={14} /> Almohadones desmontables</li>
                                    <li className="feature-item"><Check size={14} /> Diseño moderno</li>
                                    <li className="feature-item"><Check size={14} /> Fabricación nacional</li>
                                </ul>

                                <div className="price-tag">$17.900</div>
                            </div>
                            <div className="product-images">
                                <img src="https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=600&auto=format&fit=crop" alt="Londres Main" className="img-main" />
                                <div className="img-sub-row">
                                    <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=400&auto=format&fit=crop" alt="Londres Detalle 1" className="img-sub" />
                                    <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop" alt="Londres Detalle 2" className="img-sub" />
                                </div>
                            </div>
                        </div>
                        <div className="card-bottom-action">
                            <MessageCircle size={16} /> Consultas por WhatsApp
                        </div>
                    </div>
                </div>

                {/* ROW 3 */}
                <div className="grid-row-2">
                    {/* Product 04 */}
                    <div className="card product-card">
                        <div className="product-content">
                            <div className="product-info">
                                <div className="product-number">04.</div>
                                <div className="product-title">SILLÓN INDIVIDUAL<br/>OSLO</div>
                                
                                <div className="product-medidas">
                                    <Ruler size={16} />
                                    <span>Medidas:<br/>0,90 m</span>
                                </div>

                                <div className="colores-title">Colores disponibles:</div>
                                <div className="colores-swatches">
                                    <div className="swatch" style={{background: '#e0d8c8'}}></div>
                                    <div className="swatch" style={{background: '#a8a29a'}}></div>
                                    <div className="swatch" style={{background: '#635e58'}}></div>
                                    <div className="swatch" style={{background: '#444'}}></div>
                                </div>

                                <ul className="features-list">
                                    <li className="feature-item"><Check size={14} /> Tela antimanchas</li>
                                    <li className="feature-item"><Check size={14} /> Almohadón de asiento fijo</li>
                                    <li className="feature-item"><Check size={14} /> Patas de madera maciza</li>
                                    <li className="feature-item"><Check size={14} /> Diseño minimalista</li>
                                </ul>

                                <div className="price-tag">$11.900</div>
                            </div>
                            <div className="product-images">
                                <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600&auto=format&fit=crop" alt="Oslo Main" className="img-main" />
                                <div className="img-sub-row">
                                    <img src="https://images.unsplash.com/photo-1512212621149-107ffe572d2f?q=80&w=400&auto=format&fit=crop" alt="Oslo Detalle 1" className="img-sub" />
                                    <img src="https://images.unsplash.com/photo-1540574163026-643ea20d25b5?q=80&w=400&auto=format&fit=crop" alt="Oslo Detalle 2" className="img-sub" />
                                </div>
                            </div>
                        </div>
                        <div className="card-bottom-action">
                            <MessageCircle size={16} /> Consultas por WhatsApp
                        </div>
                    </div>

                    {/* Product 05 */}
                    <div className="card product-card">
                        <div className="product-content">
                            <div className="product-info">
                                <div className="product-number">05.</div>
                                <div className="product-title">SOFÁ CAMA<br/>NÁPOLES</div>
                                
                                <div className="product-medidas">
                                    <Ruler size={16} />
                                    <span>Medidas:<br/>1,90 m (sofá)<br/>1,30 x 1,90 m (cama)</span>
                                </div>

                                <div className="colores-title">Colores disponibles:</div>
                                <div className="colores-swatches">
                                    <div className="swatch" style={{background: '#e0d8c8'}}></div>
                                    <div className="swatch" style={{background: '#a8a29a'}}></div>
                                    <div className="swatch" style={{background: '#635e58'}}></div>
                                    <div className="swatch" style={{background: '#444'}}></div>
                                </div>

                                <ul className="features-list">
                                    <li className="feature-item"><Check size={14} /> Sistema sofá cama</li>
                                    <li className="feature-item"><Check size={14} /> Respaldo reclinable</li>
                                    <li className="feature-item"><Check size={14} /> Tela antimanchas</li>
                                    <li className="feature-item"><Check size={14} /> Patas metálicas</li>
                                </ul>

                                <div className="price-tag">$21.900</div>
                            </div>
                            <div className="product-images">
                                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop" alt="Nápoles Main" className="img-main" style={{filter: 'grayscale(60%) brightness(0.8)'}} />
                                <div className="img-sub-row">
                                    <img src="https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=400&auto=format&fit=crop" alt="Nápoles Detalle 1" className="img-sub" style={{filter: 'grayscale(60%) brightness(0.8)'}} />
                                    <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=400&auto=format&fit=crop" alt="Nápoles Detalle 2" className="img-sub" style={{filter: 'grayscale(60%) brightness(0.8)'}} />
                                </div>
                            </div>
                        </div>
                        <div className="card-bottom-action">
                            <MessageCircle size={16} /> Consultas por WhatsApp
                        </div>
                    </div>
                </div>

                {/* Footer Features Row */}
                <div className="footer-features">
                    <div className="feature-box">
                        <div className="feature-box-icon"><CheckCircle2 size={32} strokeWidth={1.5} /></div>
                        <div className="feature-box-text">
                            <h4>CALIDAD PREMIUM</h4>
                            <p>Materiales de primera<br/>selección</p>
                        </div>
                    </div>
                    <div className="feature-box">
                        <div className="feature-box-icon"><ShieldCheck size={32} strokeWidth={1.5} /></div>
                        <div className="feature-box-text">
                            <h4>GARANTÍA</h4>
                            <p>Todos nuestros productos<br/>cuentan con garantía</p>
                        </div>
                    </div>
                    <div className="feature-box">
                        <div className="feature-box-icon"><Truck size={32} strokeWidth={1.5} /></div>
                        <div className="feature-box-text">
                            <h4>ENVÍOS A TODO<br/>EL PAÍS</h4>
                            <p>Consultá costos y tiempos</p>
                        </div>
                    </div>
                    <div className="feature-box">
                        <div className="feature-box-icon"><CreditCard size={32} strokeWidth={1.5} /></div>
                        <div className="feature-box-text">
                            <h4>FINANCIACIÓN</h4>
                            <p>Consultá por opciones<br/>de pago</p>
                        </div>
                    </div>
                </div>

                {/* Footer Black Bar */}
                <div className="footer-black-bar">
                    <div className="footer-cta">
                        <MessageCircle size={40} strokeWidth={1.5} color="#fff" />
                        <div>
                            <h3>¡ESCRIBINOS POR WHATSAPP!</h3>
                            <p>Estamos para ayudarte a elegir tu sillón ideal.</p>
                        </div>
                    </div>
                    <div className="footer-logo">
                        <div className="footer-logo-mark">H L</div>
                        <div className="footer-logo-text">HOME LIVING</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
