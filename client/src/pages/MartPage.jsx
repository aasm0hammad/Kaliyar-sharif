import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api';
import { ShoppingBag, ShoppingCart, Clock, CheckCircle2, Phone, MessageCircle, Plus, Minus, X, ChevronRight, Info, Heart, Search, Flame } from 'lucide-react';

export default function MartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  
  // Cart state: { [itemId]: { item, quantity } }
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('917248187225'); // default fallback
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/mart-items');
        setItems(res.data.filter(item => item.is_available));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching mart items:', error);
        setLoading(false);
      }
    };
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings/mart_whatsapp_number');
        if (res.data.value) setWhatsappNumber(res.data.value);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchItems();
    fetchSettings();
  }, []);

  const categories = ['ALL', ...new Set(items.map(item => item.category))];

  const filteredItems = activeCategory === 'ALL' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const updateCart = (item, delta) => {
    setCart(prev => {
      const newCart = { ...prev };
      const currentQty = newCart[item.id] ? newCart[item.id].quantity : 0;
      const newQty = currentQty + delta;

      if (newQty <= 0) {
        delete newCart[item.id];
      } else {
        newCart[item.id] = { item, quantity: newQty };
      }
      return newCart;
    });
  };

  const getCartTotalItems = () => Object.values(cart).reduce((sum, current) => sum + current.quantity, 0);
  const getCartTotalPrice = () => Object.values(cart).reduce((sum, current) => sum + (current.item.price * current.quantity), 0);

  const toggleFavorite = (itemId) => {
    setFavorites(prev => {
      const newFav = new Set(prev);
      if (newFav.has(itemId)) newFav.delete(itemId);
      else newFav.add(itemId);
      return newFav;
    });
  };

  const placeOrderOnWhatsApp = () => {
    const totalItems = getCartTotalItems();
    const totalPrice = getCartTotalPrice();
    if (totalItems === 0) return;

    let message = `*NEW ORDER - KALIYAR MART*\n\n`;
    Object.values(cart).forEach((cartItem, idx) => {
      message += `${idx + 1}. ${cartItem.item.name} ${cartItem.item.quantity_info ? `(${cartItem.item.quantity_info})` : ''} x ${cartItem.quantity} = ₹${cartItem.item.price * cartItem.quantity}\n`;
    });
    message += `\n*Total Amount:* ₹${totalPrice}\n\n`;
    message += `Please confirm my order.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsCartOpen(false);
    setCart({}); // clear cart after placing order
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-24">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight drop-shadow-md">KALIYAR MART</h1>
            <p className="text-lg md:text-xl font-bold text-green-100 mb-6 drop-shadow">Delivery in 20-30 Minutes</p>
            
            <div className="flex flex-wrap justify-center gap-3 text-sm font-bold mt-4">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 flex items-center gap-2 shadow-sm">
                <Clock size={16} className="text-yellow-300" /> 9 AM to 11 PM
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 flex items-center gap-2 shadow-sm">
                <ShoppingCart size={16} className="text-blue-200" /> MIN ORDER: ₹200
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="container mx-auto px-4 py-8">
          
          {/* Search & Categories */}
          <div className="sticky top-0 bg-gray-50 z-20 pt-4 pb-2 -mx-4 px-4 shadow-sm border-b border-gray-200 mb-6">
            <div className="max-w-6xl mx-auto flex flex-col gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for food, drinks, groceries..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                />
              </div>
              {/* Categories */}
              <div className="flex overflow-x-auto gap-2 scrollbar-none justify-start pb-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm flex-shrink-0 ${activeCategory === cat ? 'bg-green-600 text-white scale-105 shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-6xl mx-auto">
              {categories.filter(c => c !== 'ALL').map(category => {
                const categoryItems = items.filter(i => 
                  i.category === category && 
                  i.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                if (activeCategory !== 'ALL' && activeCategory !== category) return null;
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden break-inside-avoid mb-6 hover:shadow-md transition-shadow">
                    <div className="bg-gray-50 text-gray-800 py-3 px-4 font-black tracking-widest uppercase border-b border-gray-100 text-sm">
                      {category}
                    </div>
                    <ul className="divide-y divide-gray-50">
                      {categoryItems.map((item) => {
                        const cartItem = cart[item.id];
                        const quantity = cartItem ? cartItem.quantity : 0;

                        return (
                          <li key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center py-4 px-4 hover:bg-gray-50/50 transition-colors group relative">
                            {/* Popular Badge */}
                            {item.id % 4 === 0 && (
                              <div className="absolute top-2 right-4 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">
                                <Flame size={10} /> BESTSELLER
                              </div>
                            )}

                            <div className="flex items-center gap-4 flex-1 mb-3 sm:mb-0">
                              <div className="relative shrink-0">
                                {item.img_url ? (
                                  <img src={item.img_url} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-gray-100 shadow-sm bg-gray-50 group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                  <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                                    <ShoppingBag size={24} className="text-gray-300" />
                                  </div>
                                )}
                                {/* Favorite Button */}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                                  className="absolute -top-2 -left-2 w-7 h-7 bg-white rounded-full shadow border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10"
                                >
                                  <Heart size={14} className={favorites.has(item.id) ? "fill-red-500 text-red-500" : ""} />
                                </button>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800 leading-tight mb-1 group-hover:text-green-700 transition-colors">{item.name}</h3>
                                {item.quantity_info && <p className="text-[11px] text-gray-500 font-bold mb-1.5">{item.quantity_info}</p>}
                                <div className="flex items-center gap-3">
                                  <div className="font-black text-gray-800 text-sm">
                                    ₹{item.price}
                                  </div>
                                  <div className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-bold border border-orange-100">
                                    <Clock size={10} /> 15-20 min
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="sm:ml-4 shrink-0 flex justify-end">
                              {quantity === 0 ? (
                                <button 
                                  onClick={() => updateCart(item, 1)}
                                  className="border border-green-600 text-green-700 bg-green-50 hover:bg-green-100 px-6 py-1.5 rounded-lg font-black text-sm transition-colors shadow-sm w-24 flex justify-center"
                                >
                                  ADD
                                </button>
                              ) : (
                                <div className="flex items-center justify-between bg-green-600 text-white rounded-lg shadow-sm w-24 h-8 px-1">
                                  <button onClick={() => updateCart(item, -1)} className="w-8 h-full flex items-center justify-center font-bold text-lg hover:bg-green-700 rounded-l-lg transition-colors">
                                    <Minus size={14} />
                                  </button>
                                  <span className="font-bold text-sm w-6 text-center">{quantity}</span>
                                  <button onClick={() => updateCart(item, 1)} className="w-8 h-full flex items-center justify-center font-bold text-lg hover:bg-green-700 rounded-r-lg transition-colors">
                                    <Plus size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      {/* Floating Cart Strip (Blinkit Style) */}
      {getCartTotalItems() > 0 && !isCartOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] p-4 animate-[slideUp_0.3s_ease-out]">
          <div className="container mx-auto max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-700 w-12 h-12 rounded-xl flex items-center justify-center relative shadow-sm">
                <ShoppingBag size={24} />
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {getCartTotalItems()}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Total</p>
                <p className="text-lg font-black text-gray-800">₹{getCartTotalPrice()}</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-600/30 transition-all flex items-center gap-2 hover:-translate-y-0.5"
            >
              View Cart <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-gray-50 h-full flex flex-col shadow-2xl animate-[slideLeft_0.3s_ease-out]">
            
            <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <ShoppingCart className="text-green-600" /> My Cart
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-sm font-bold text-gray-700">Delivery in 20-30 mins</span>
                </div>

                <div className="space-y-4">
                  {Object.values(cart).map(cartItem => (
                    <div key={cartItem.item.id} className="flex gap-3">
                      {cartItem.item.img_url ? (
                         <img src={cartItem.item.img_url} alt={cartItem.item.name} className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0 bg-gray-50" />
                      ) : (
                         <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                           <ShoppingBag size={20} className="text-gray-300" />
                         </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <p className="text-sm font-bold text-gray-800 leading-tight">{cartItem.item.name}</p>
                          {cartItem.item.quantity_info && <p className="text-xs text-gray-500 mt-0.5">{cartItem.item.quantity_info}</p>}
                        </div>
                        <p className="font-black text-gray-800 text-sm mt-1">₹{cartItem.item.price * cartItem.quantity}</p>
                      </div>
                      
                      <div className="flex items-center justify-between bg-green-600 text-white rounded-lg shadow-sm w-20 h-8 self-end mb-1">
                        <button onClick={() => updateCart(cartItem.item, -1)} className="w-6 h-full flex items-center justify-center font-bold hover:bg-green-700 rounded-l-lg transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-xs w-6 text-center">{cartItem.quantity}</span>
                        <button onClick={() => updateCart(cartItem.item, 1)} className="w-6 h-full flex items-center justify-center font-bold hover:bg-green-700 rounded-r-lg transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">Bill Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Item Total</span>
                    <span className="font-medium">₹{getCartTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charge</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <div className="border-t border-gray-100 my-2 pt-2 flex justify-between font-black text-gray-800">
                    <span>Grand Total</span>
                    <span>₹{getCartTotalPrice()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 text-blue-800 p-3 rounded-xl flex items-start gap-2 text-xs font-medium border border-blue-100">
                <Info size={16} className="shrink-0 mt-0.5 text-blue-500" />
                <p>By proceeding, your order will be placed instantly via WhatsApp. Our team will confirm the delivery with you.</p>
              </div>

            </div>

            <div className="bg-white p-4 border-t border-gray-100 sticky bottom-0">
               <button 
                onClick={placeOrderOnWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-black text-base shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                Place Order on WhatsApp <MessageCircle size={20} />
              </button>
            </div>

          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
