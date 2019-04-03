import { shallowMount } from '@vue/test-utils'
import Posts from '@/components/Home/Posts'

// https://alligator.io/vuejs/testing-vue-with-jest/
// https://www.synbioz.com/blog/testez_unitairement_application_vuejs_jest

function mountComponentWithProps (Component, propsData) {
  const Constructor = Vue.extend(Component);
  const vm = new Constructor({
    propsData
  }).$mount();

  return vm.$el;
}

describe('Posts.vue', () => {
  it('posts should not be empty', () => {
    const PostsData = mountComponentWithProps(Posts, { all: [] });
    const allData = PostData.all;

    console.log(allData)

    expect(allData).toBe([])
  })
})
