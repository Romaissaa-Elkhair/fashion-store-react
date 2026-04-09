import React, { useState } from 'react';

export default function FashionStorePro() {
  const [activePage, setActivePage] = useState('home');
  const [cart, setCart] = useState([]);

  const products = [
    {
      id: 1,
      name: 'Premium T-Shirt',
      price: 29,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'
    },
    {
      id: 2,
      name: 'Luxury Jacket',
      price: 79,
      image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234'
    },
    {
      id: 3,
      name: 'Urban Sneakers',
      price: 59,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
    },
    {
      id: 4,
      name: 'Elegant Hoodie',
      price: 49,
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'
    }
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', sans-serif;
          scroll-behavior: smooth;
        }

        body {
          background: #f4f7fb;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 50px;
          background: linear-gradient(90deg,#0f172a,#1e293b);
          color: white;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #38bdf8;
        }

        .menu {
          display: flex;
          gap: 20px;
          list-style: none;
        }

        .menu li {
          cursor: pointer;
          padding: 10px 18px;
          border-radius: 8px;
          transition: 0.3s;
        }

        .menu li:hover, .active {
          background: #38bdf8;
          color: #0f172a;
          font-weight: bold;
        }

        .hero {
          min-height: 90vh;
          background: linear-gradient(rgba(15,23,42,.75),rgba(15,23,42,.75)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8');
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          text-align: center;
          animation: fadeIn 1.2s ease;
        }

        .hero h1 {
          font-size: 58px;
          margin-bottom: 20px;
        }

        .hero p {
          font-size: 20px;
          margin-bottom: 25px;
        }

        .btn {
          padding: 14px 30px;
          background: #38bdf8;
          border: none;
          border-radius: 10px;
          font-size: 17px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }

        .btn:hover {
          transform: scale(1.08);
          background: #0ea5e9;
        }

        .section {
          padding: 60px 50px;
          animation: fadeIn 1s ease;
        }

        .title {
          text-align: center;
          font-size: 40px;
          margin-bottom: 40px;
          color: #0f172a;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
          gap: 30px;
        }

        .card {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          transition: 0.4s;
        }

        .card:hover {
          transform: translateY(-10px);
        }

        .card img {
          width: 100%;
          height: 280px;
          object-fit: cover;
        }

        .card-body {
          padding: 20px;
          text-align: center;
        }

        .price {
          color: #0ea5e9;
          font-size: 22px;
          margin: 10px 0;
        }

        .cart-item {
          background: white;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .footer {
          background: #0f172a;
          color: white;
          text-align: center;
          padding: 25px;
          margin-top: 40px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div>
        <nav className="navbar">
          <div className="logo">FashionPro</div>
          <ul className="menu">
            <li className={activePage==='home'?'active':''} onClick={()=>setActivePage('home')}>Accueil</li>
            <li className={activePage==='products'?'active':''} onClick={()=>setActivePage('products')}>Produits</li>
            <li className={activePage==='cart'?'active':''} onClick={()=>setActivePage('cart')}>
              Panier ({cart.length})
            </li>
            <li className={activePage==='contact'?'active':''} onClick={()=>setActivePage('contact')}>Contact</li>
          </ul>
        </nav>

        {activePage === 'home' && (
          <section className="hero">
            <h1>Fashion Collection 2026</h1>
            <p>Découvrez les meilleures tendances avec élégance.</p>
            <button className="btn" onClick={()=>setActivePage('products')}>Explorer la Collection</button>
          </section>
        )}

        {activePage === 'products' && (
          <section className="section">
            <h2 className="title">Nos Produits</h2>
            <div className="grid">
              {products.map(product => (
                <div className="card" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div className="card-body">
                    <h3>{product.name}</h3>
                    <p className="price">${product.price}</p>
                    <button className="btn" onClick={()=>addToCart(product)}>
                      Ajouter au Panier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activePage === 'cart' && (
          <section className="section">
            <h2 className="title">Votre Panier</h2>
            {cart.length === 0 ? (
              <p style={{textAlign:'center'}}>Votre panier est vide.</p>
            ) : (
              <>
                {cart.map((item,index)=>(
                  <div className="cart-item" key={index}>
                    <span>{item.name} - ${item.price}</span>
                    <button className="btn" onClick={()=>removeFromCart(index)}>Supprimer</button>
                  </div>
                ))}
                <h3 style={{marginTop:'20px'}}>Total: ${total}</h3>
              </>
            )}
          </section>
        )}

        {activePage === 'contact' && (
          <section className="section">
            <h2 className="title">Contact</h2>
            <p style={{textAlign:'center',fontSize:'20px'}}>📧 contact@fashionpro.com</p>
            <p style={{textAlign:'center',fontSize:'20px'}}>📞 +212 600000000</p>
          </section>
        )}

        <footer className="footer">
          © 2026 FashionPro - Tous droits réservés.
        </footer>
      </div>
    </>
  );
}
