import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, RotateCcw, Palette, User } from 'lucide-react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'

const AvatarCustomization = () => {
  const [avatar, setAvatar] = useState({
    hairStyle: 'short',
    hairColor: '#8B4513',
    skinColor: '#F4C2A1',
    shirtStyle: 'casual',
    shirtColor: '#4ECDC4',
    accessory: 'none'
  })

  const [activeSection, setActiveSection] = useState('hair')

  const hairStyles = [
    { id: 'short', name: 'Short', preview: '👨' },
    { id: 'long', name: 'Long', preview: '👩' },
    { id: 'curly', name: 'Curly', preview: '👨‍🦱' },
    { id: 'bald', name: 'Bald', preview: '👨‍🦲' }
  ]

  const shirtStyles = [
    { id: 'casual', name: 'Casual' },
    { id: 'formal', name: 'Formal' },
    { id: 'hoodie', name: 'Hoodie' },
    { id: 'tank', name: 'Tank Top' }
  ]

  const accessories = [
    { id: 'none', name: 'None' },
    { id: 'glasses', name: 'Glasses', preview: '👓' },
    { id: 'hat', name: 'Hat', preview: '🧢' },
    { id: 'headphones', name: 'Headphones', preview: '🎧' }
  ]

  const colors = [
    '#8B4513', '#D2691E', '#CD853F', '#F4A460', '#DEB887',
    '#FFE4B5', '#F5DEB3', '#FFEFD5', '#FDF5E6', '#FAF0E6',
    '#4ECDC4', '#FF6B6B', '#FFD93D', '#6BCF7F', '#42A5F5',
    '#9C27B0', '#FF9800', '#795548', '#607D8B', '#000000'
  ]

  const updateAvatar = (field, value) => {
    setAvatar(prev => ({ ...prev, [field]: value }))
  }

  const resetAvatar = () => {
    setAvatar({
      hairStyle: 'short',
      hairColor: '#8B4513',
      skinColor: '#F4C2A1',
      shirtStyle: 'casual',
      shirtColor: '#4ECDC4',
      accessory: 'none'
    })
  }

  const saveAvatar = () => {
    localStorage.setItem('userAvatar', JSON.stringify(avatar))
    // Toast notification would go here if needed
    console.log('Avatar saved!', avatar)
  }

  const sections = [
    { id: 'hair', name: 'Hair', icon: '💇' },
    { id: 'skin', name: 'Skin', icon: '👤' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'accessories', name: 'Accessories', icon: '🕶️' }
  ]

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display text-primary mb-2">
            Customize Your Avatar
          </h1>
          <p className="text-gray-600 text-lg">
            Make your learning journey uniquely yours!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Avatar Preview */}
          <div className="lg:col-span-1">
            <Card className="p-8 text-center sticky top-4">
              <h3 className="text-xl font-display text-gray-800 mb-6">Preview</h3>
              
              {/* Simple Avatar Representation */}
              <motion.div
                key={`${avatar.hairStyle}-${avatar.hairColor}-${avatar.skinColor}-${avatar.shirtColor}-${avatar.accessory}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-48 h-48 mx-auto mb-6 rounded-full flex items-center justify-center text-8xl relative overflow-hidden"
                style={{ backgroundColor: avatar.skinColor }}
              >
                {/* Hair representation */}
                <div 
                  className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-16 rounded-t-full"
                  style={{ backgroundColor: avatar.hairColor }}
                />
                
                {/* Face */}
                <div className="text-4xl">😊</div>
                
                {/* Accessory */}
                {avatar.accessory !== 'none' && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-3xl">
                    {accessories.find(a => a.id === avatar.accessory)?.preview}
                  </div>
                )}
              </motion.div>

              {/* Shirt representation */}
              <motion.div
                className="w-32 h-20 mx-auto rounded-t-3xl"
                style={{ backgroundColor: avatar.shirtColor }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              />

              <div className="flex gap-3 mt-8">
                <Button
                  onClick={saveAvatar}
                  className="flex-1 bg-success hover:bg-green-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={resetAvatar}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </Card>
          </div>

          {/* Customization Options */}
          <div className="lg:col-span-2">
            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-primary text-white shadow-card'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.name}
                </button>
              ))}
            </div>

            {/* Hair Section */}
            {activeSection === 'hair' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6 mb-6">
                  <h3 className="text-lg font-display text-gray-800 mb-4">Hair Style</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {hairStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => updateAvatar('hairStyle', style.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          avatar.hairStyle === style.id
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{style.preview}</div>
                        <div className="text-sm font-medium">{style.name}</div>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-display text-gray-800 mb-4 flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Hair Color
                  </h3>
                  <div className="grid grid-cols-10 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateAvatar('hairColor', color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          avatar.hairColor === color
                            ? 'border-primary scale-110'
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Skin Section */}
            {activeSection === 'skin' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-display text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Skin Tone
                  </h3>
                  <div className="grid grid-cols-8 gap-3">
                    {[
                      '#F4C2A1', '#E8B894', '#D4A574', '#C89158', '#B87333',
                      '#A0522D', '#8B4513', '#654321'
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => updateAvatar('skinColor', color)}
                        className={`w-12 h-12 rounded-full border-2 transition-all ${
                          avatar.skinColor === color
                            ? 'border-primary scale-110'
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Clothing Section */}
            {activeSection === 'clothing' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6 mb-6">
                  <h3 className="text-lg font-display text-gray-800 mb-4">Shirt Style</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {shirtStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => updateAvatar('shirtStyle', style.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          avatar.shirtStyle === style.id
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{style.name}</div>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-display text-gray-800 mb-4 flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Shirt Color
                  </h3>
                  <div className="grid grid-cols-10 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateAvatar('shirtColor', color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          avatar.shirtColor === color
                            ? 'border-primary scale-110'
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Accessories Section */}
            {activeSection === 'accessories' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-display text-gray-800 mb-4">Accessories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {accessories.map((accessory) => (
                      <button
                        key={accessory.id}
                        onClick={() => updateAvatar('accessory', accessory.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          avatar.accessory === accessory.id
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {accessory.preview && (
                          <div className="text-2xl mb-2">{accessory.preview}</div>
                        )}
                        <div className="text-sm font-medium">{accessory.name}</div>
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvatarCustomization