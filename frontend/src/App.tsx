import './App.css'
function App() {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure><img src="https://secure-static.vans.com.br/medias/sys_master/vans/vans/hcb/hae/h00/h00/12094890508318/1002003090001U-02-BASEIMAGE-Midres.png" alt="Shoes" /></figure>
      <div className="card-body">
        <h2 className="card-title">Shoes!</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  )
}

export default App
