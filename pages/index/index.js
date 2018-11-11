//first program

const weatherMap= {
  'sunny':'晴天',
  'cloudy':'多云',
  'overcast':'阴天',
  'lightrain':'小雨',
  'heavyrain':'大雨',
  'snow':'下雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({
  data:{
    nowTemp:'',
    nowWeather:'',
    nowWeatherBg:'',
    hourlyWeather:[]
  },
  onLoad(){
    this.getNowWeather()
  },
  onPullDownRefresh(){
    this.getNowWeather(()=>{
      wx.stopPullDownRefresh()
    })
    console.log("Refresh done!")
  },
  getNowWeather(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city:'哈尔滨'
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        let result=res.data.result
        this.setNow(result)
        this.setHourlyWeather(result)        
      },
      complete: ()=>{
        callback && callback()
      }
    })
  },
  setNow(result) {
    let temp = result.now.temp
    let weather = result.now.weather
    console.log(temp, weather)
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBg: '/images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather]
    })
  },
  setHourlyWeather(result) {
    //set hourlyWeather
    let forecast = result.forecast
    let nowHour = new Date().getHours()
    let hourlyWeather = []
    for (let i = 0; i < 8; i++) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + '时',
        weatherIcon: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },
})
